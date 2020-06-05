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
