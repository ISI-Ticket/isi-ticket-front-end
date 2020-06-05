const express = require('express');
const app = express();
const path = require('path');
/*const https = require('https');
const fs = require('fs');
const crypto = require('crypto');

let certOptions = {
  key: fs.readFileSync(path.resolve(__dirname, 'cert/rootCA.key')),
  cert: fs.readFileSync(path.resolve(__dirname, 'cert/rootCA.crt')),
  passphrase: 'cegonha420'
}*/

app.use(express.static(path.join(__dirname)));
app.use("/vendor/css", express.static(__dirname + '/vendor/css'));
app.use("/vendor/img", express.static(__dirname + '/vendor/img'));
app.use("/vendor/js", express.static(__dirname + '/vendor/js'));

app.get('/test', (req, res) => {
  res.send('Hello World!');
})

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
  console.log("Running on port: " + PORT);
});

/*let server = https.createServer(certOptions, app).listen(PORT, () => {
  console.log("Running on port: " + PORT);
});*/