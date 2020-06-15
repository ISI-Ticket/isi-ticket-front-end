const bodyParser = require('body-parser');
const webPush = require('web-push');
const cron = require('node-cron');
const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname)));
app.use("/vendor/css", express.static(__dirname + '/vendor/css'));
app.use("/vendor/img", express.static(__dirname + '/vendor/img'));
app.use("/vendor/js", express.static(__dirname + '/vendor/js'));

app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
      if (req.url.indexOf('http') > -1) {
        let httpsUrl = req.url.replace('http', 'https');
        return res.redirect(httpsUrl);
      }
      else
          return next();
  } else
      return next();
});

app.get('/test', (req, res) => {
  res.send('Hello World!');
})

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
  console.log("Running on port: " + PORT);
});

const allSubscriptions = {};

const { publicKey, privateKey } = webPush.generateVAPIDKeys();

webPush.setVapidDetails(
  'https://isi-ticket.herokuapp.com/vendor/pages/ementa.html',
  publicKey,
  privateKey
);

app.use(bodyParser.json());

app.get('/vapid-public-key', (req, res) => res.send({ publicKey }));

app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  registerTasks(subscription);
  res.send('subscribed!');
});

const registerTasks = (subscription) => {
  const endpoint = subscription.endpoint;
  
  const morningTask = cron.schedule('7 4 * * *', () => {
    sendNotification(subscription, JSON.stringify({ timeOfDay: 'morning' }));
  });

  const afternoonTask = cron.schedule('10 4 * * *', () => {
    sendNotification(subscription, JSON.stringify({ timeOfDay: 'afternoon' }));
  });

  allSubscriptions[endpoint] = [morningTask, afternoonTask, nightTask];
};

app.post('/unsubscribe', (req, res) => {
  const endpoint = req.body.endpoint;
  allSubscriptions[endpoint].forEach(task => {
    task.destroy();
  });
  delete allSubscriptions[endpoint];
});

const sendNotification = async (subscription, payload) => {
  // This means we won't resend a notification if the client is offline
  const options = {
    TTL: 0
  };

  if (!subscription.keys) {
    payload = payload || null;
  }

  try {
    const res = await webPush.sendNotification(subscription, payload, options);
    console.log(res, 'sent!');
  } catch (e) {
    console.log('error sending', e);
  }
}
