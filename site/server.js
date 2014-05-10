var app = require('express')();
var server = require('http').createServer(app);
var webRTC = require('webrtc.io').listen(server);

var port = process.env.PORT || 8080;
server.listen(port, '0.0.0.0');



app.get('/', function(req, res) {
  res.sendfile(__dirname + '/talk.html');
});

app.get('/webcamtest.html', function(req, res) {
  res.sendfile(__dirname + '/webcamtest.html');
});

app.get('/red.png', function(req, res) {
  res.sendfile(__dirname + '/red.png');
});

app.get('/blue.png', function(req, res) {
  res.sendfile(__dirname + '/blue.png');
});

app.get('/green.png', function(req, res) {
  res.sendfile(__dirname + '/green.png');
});

app.get('/purple.png', function(req, res) {
  res.sendfile(__dirname + '/purple.png');
});

app.get('/yellow.png', function(req, res) {
  res.sendfile(__dirname + '/yellow.png');
});

app.get('/orange.png', function(req, res) {
  res.sendfile(__dirname + '/orange.png');
});

app.get('/index.html', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/Finallogo.png', function(req, res) {
  res.sendfile(__dirname + '/Finallogo.png');
});

app.get('/front.css', function(req, res) {
  res.sendfile(__dirname + '/front.css');
});

app.get('/style.css', function(req, res) {
  res.sendfile(__dirname + '/style.css');
});

app.get('/bootstrap.min.css', function(req, res) {
  res.sendfile(__dirname + '/bootstrap.min.css');
});

app.get('/fullscrean.png', function(req, res) {
  res.sendfile(__dirname + '/fullscrean.png');
});

app.get('/script.js', function(req, res) {
  res.sendfile(__dirname + '/script.js');
});

app.get('/bootstrap.js', function(req, res) {
  res.sendfile(__dirname + '/bootstrap.js');
});

app.get('http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js', function(req, res) {
  res.sendfile(__dirname + "http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js");
});

app.get('/webrtc.io.js', function(req, res) {
  res.sendfile(__dirname + '/webrtc.io.js');
});

webRTC.rtc.on('chat_msg', function(data, socket) {
  var roomList = webRTC.rtc.rooms[data.room] || [];

  for (var i = 0; i < roomList.length; i++) {
    var socketId = roomList[i];

    if (socketId !== socket.id) {
      var soc = webRTC.rtc.getSocket(socketId);

      if (soc) {
        soc.send(JSON.stringify({
          "eventName": "receive_chat_msg",
          "data": {
            "messages": data.messages,
            "color": data.color
          }
        }), function(error) {
          if (error) {
            console.log(error);
          }
        });
      }
    }
  }
});
