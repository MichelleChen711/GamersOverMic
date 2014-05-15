var app = require('express')();
var server = require('http').createServer(app);
var webRTC = require('webrtc.io').listen(server);

var port = process.env.PORT || 8080;
server.listen(port);



app.get('/', function(req, res) {
  res.sendfile(__dirname + '/talk.html');
});

app.get('/index.html', function(req, res) {
  res.sendfile(__dirname + '/index.html');
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
