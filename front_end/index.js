const bodyParser = require('body-parser');
const webPush = require('web-push');
const cron = require('node-cron');
const express = require('express');
const app = express();
const path = require('path');
let notificationTime;

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

app.post('/notificationTime', (req, res) => {
  notificationTime = req.body;
  res.send('ok!')
});

app.post('/subscribe', (req, res) => {
  const subscription = req.body;
    registerTasks(subscription);
  res.send('subscribed!');
});

const registerTasks = (subscription) => {
  const endpoint = subscription.endpoint;
  
  console.log(notificationTime)

  const lunchNotification = cron.schedule(`${notificationTime.lunchMinutes} ${notificationTime.lunchHours} * * *`, () => {
    sendNotification(subscription, JSON.stringify({ timeOfDay: 'morning' }));
  });

  const dinnerNotification = cron.schedule(`${notificationTime.dinnerMinutes} ${notificationTime.dinnerHours} * * *`, () => {
    sendNotification(subscription, JSON.stringify({ timeOfDay: 'afternoon' }));
  });

  allSubscriptions[endpoint] = [lunchNotification, dinnerNotification];
};

app.post('/unsubscribe', (req, res) => {
  const endpoint = req.body.endpoint;
  allSubscriptions[endpoint].forEach(task => {
    task.destroy();
  });
  delete allSubscriptions[endpoint];
});

const sendNotification = async (subscription, payload) => {
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
