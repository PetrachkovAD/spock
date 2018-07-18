var express = require('express');
var app = express();
var http = require('http').Server(app);
var url = require('url');
var fs = require('fs');
var path = require('path');

app.get('/react', function(req, res) {
  html = fs.ReadStream(path.join(__dirname, 'client/build', 'index.html'));
  sendFile(html, res);
})

app.get('/chat', function(req, res) {
  html = fs.ReadStream('chat/chat.html');
  sendFile(html, res);
});

app.get('/connect', function(req, res) {
  res.status(200).send(req.query.id);
})

app.use(express.static(path.join(__dirname, 'client/build')));

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

http.listen(8080, '0.0.0.0');

function sendFile(file, res) {  //Зачем?
  file.pipe(res);

  file.on('error', (err) => {
    res.status(500).end('Server error');
    console.log(err);
  })
};

require('./sockets')(http);