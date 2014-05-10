var videos = [];
var PeerConnection = window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection || window.mozRTCPeerConnection || window.RTCPeerConnection;
var roomname;
var users = [];

function getNumPerRow() {
  var len = videos.length;
  var biggest;

  // Ensure length is even for better division.
  if(len % 2 === 1) {
    len++;
  }

  biggest = Math.ceil(Math.sqrt(len));
  while(len % biggest !== 0) {
    biggest++;
  }
  return biggest;
}

function subdivideVideos() {
  var perRow = getNumPerRow();
  var numInRow = 0;
  for(var i = 0, len = videos.length; i < len; i++) {
    var video = videos[i];
    setWH(video, i);
    numInRow = (numInRow + 1) % perRow;
  }
}

function setWH(video, i) {
  var perRow = getNumPerRow();
  var perColumn = Math.ceil(videos.length / perRow);
  var width = Math.floor((window.innerWidth) / perRow);
  var height = Math.floor((window.innerHeight - 190) / perColumn);
  video.width = width;
  video.height = height;
  video.style.position = "absolute";
  video.style.left = (i % perRow) * width + "px";
  video.style.top = Math.floor(i / perRow) * height + "px";
}

function cloneVideo(domId, socketId) {
  var video = document.getElementById(domId);
  var clone = video.cloneNode(false);
  clone.id = "remote" + socketId;
  document.getElementById('videos').appendChild(clone);
  videos.push(clone);
  var img = document.createElement("img");

  if (videos.length === 1){
    img.src = "blue.png";
    img.width = 85;
    img.height = 85;
    img.id = "blue";
    document.getElementById('users').appendChild(img);
    var elementStyle = document.getElementById("blue").style;
    elementStyle.position = "absolute";
    elementStyle.top = "250px";
    elementStyle.left = "200px";
    $(document).ready(function(){
      $("#blue").effect( "bounce", {times:5}, 2000 );
    });
  }

  if (videos.length === 2){
    img.src = "green.png";
    img.width = 85;
    img.height = 85;
    img.id = "green";
    document.getElementById('users').appendChild(img);
    img.id = "green";
    document.getElementById('users').appendChild(img);
    document.getElementById("green").style.position = "absolute";
    document.getElementById("green").style.top = "250px";
    document.getElementById("green").style.left = "300px";
    $(document).ready(function(){
      $("#green").effect( "bounce", {times:5}, 2000 );
    });
  }

  if (videos.length === 3){
    img.src = "purple.png";
    img.width = 85;
    img.height = 85;
    img.id = "purple";
    document.getElementById('users').appendChild(img);
    img.id = "purple";
    document.getElementById('users').appendChild(img);
    document.getElementById("purple").style.position = "absolute";
    document.getElementById("purple").style.top = "250px";
    document.getElementById("purple").style.left = "400px";
    $(document).ready(function(){
      $("#purple").effect( "bounce", {times:5}, 2000 );
    });
  }
  if (videos.length === 4){
    img.src = "orange.png";
    img.width = 85;
    img.height = 85;
    img.id = "orange";
    document.getElementById('users').appendChild(img);
    img.id = "orange";
    document.getElementById('users').appendChild(img);
    document.getElementById("orange").style.position = "absolute";
    document.getElementById("orange").style.top = "250px";
    document.getElementById("orange").style.left = "500px";
    $(document).ready(function(){
      $("#orange").effect( "bounce", {times:5}, 2000 );
    });
  }

  return clone;
}

function removeVideo(socketId) {
  var video = document.getElementById('remote' + socketId);
  if(video) {
    videos.splice(videos.indexOf(video), 1);
    video.parentNode.removeChild(video);
  }
}

function addToChat(msg, color) {
  var messages = document.getElementById('messages');
  msg = sanitize(msg);
  if(color) {
    msg = '<span style="color: ' + color + '; padding-left: 0px">' + msg + '</span>';
  } else {
    msg = '<span style="color: ' + color + '; padding-left: 0px">' + msg + '</span>';
	var username = document.getElementById("secretname").innerHTML + ": ";
	msg = username + msg;
	msg = '<strong style>' + msg + '</strong>';
  }
  messages.innerHTML = messages.innerHTML + msg + '<br>';
  messages.scrollTop = 10000;
}

function sanitize(msg) {
  return msg.replace(/</g, '&lt;');
}

function initFullScreen() {
  var button = document.getElementById("fullscreen");
  button.addEventListener('click', function(event) {
    var elem = document.getElementById("videos");
    //show full screen
    elem.webkitRequestFullScreen();
  });
}

function initNewRoom() {
  var button = document.getElementById("newRoom");

  button.addEventListener('click', function(event) {

    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = 8;
    var randomstring = '';
    for(var i = 0; i < string_length; i++) {
      var rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
    }
    roomname = document.getElementById('room_name').value;
    username = document.getElementById('user_name').value;

    window.location.assign(window.location + "index.html?username=" + username + "#" + roomname);   
    //window.location.hash = randomstring;
    //location.replace(window.location);
  })

}


var websocketChat = {
  send: function(message) {
    rtc._socket.send(message);
  },
  recv: function(message) {
    return message;
  },
  event: 'receive_chat_msg'
};

var dataChannelChat = {
  send: function(message) {
    for(var connection in rtc.dataChannels) {
      var channel = rtc.dataChannels[connection];
      channel.send(message);
    }
  },
  recv: function(channel, message) {
    return JSON.parse(message).data;
  },
  event: 'data stream data'
};

function initChat() {
  var chat;
  if(rtc.dataChannelSupport) {
    console.log('initializing data channel chat');
    chat = dataChannelChat;
  } else {
    console.log('initializing websocket chat');
    chat = websocketChat;
  }

  var input = document.getElementById("chatinput");
  var toggleHideShow = document.getElementById("hideShowMessages");
  var room = window.location.hash.slice(1);
  var color = "#" + ((1 << 24) * Math.random() | 0).toString(16);

  toggleHideShow.addEventListener('click', function() {
    var element = document.getElementById("messages");

    if(element.style.display === "block") {
      element.style.display = "none";
    }
    else {
      element.style.display = "block";
    }

  });

  input.addEventListener('keydown', function(event) {
    var key = event.which || event.keyCode;
    if(key === 13) {
      chat.send(JSON.stringify({
        "eventName": "chat_msg",
        "data": {
          "messages": document.getElementById("secretname").innerHTML + ": " + input.value,
          "room": room,
          "color": color
        }
      }));
      addToChat(input.value);
      input.value = "";
    }
  }, false);
  rtc.on(chat.event, function() {
    var data = chat.recv.apply(this, arguments);
    console.log(data.color);
    addToChat(data.messages, data.color.toString(16));
  });
}


function init(){
  document.getElementById('header').innerHTML = "Chatroom: " + window.location.hash.substr(1);
  var img = document.createElement("img");
  img.src = "red.png";
  img.width = 85;
  img.height = 85;
  img.id = "red";
  document.getElementById('users').appendChild(img);
  document.getElementById("red").style.position = "relative";
  document.getElementById("red").style.top = "250px";
  document.getElementById("red").style.left = "100px";

  $(document).ready(function(){
    $("#red").effect( "bounce", {times:5}, 2000 );
    //$("#red").effect("bounce", {easing:'easeOutBounce'}, 3000 );
  });

  var secretname = document.URL;
  console.log(secretname);
  secretname = secretname.slice(38, secretname.length);
  if (secretname.charAt(0) === '?'){
    secretname = secretname.slice(10, secretname.length);
  }
  console.log(secretname);
  for(var i = secretname.length; i >= 0; i--){
    if(secretname.charAt(i) === '#'){
      secretname = secretname.substr(0, i);
      if (secretname.length === 1){
        console.log('WOITJEOIFJDSFOIS WTFFFF');
      }
      break;
    }
    secretname = secretname.substr(0, i);
  }

  if(secretname.length === 0){
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = 4;
    secretname = "Temp-";
    for(var i = 0; i < string_length; i++) {
      var rnum = Math.floor(Math.random() * chars.length);
      secretname += chars.substring(rnum, rnum + 1);
    }
  }

  document.getElementById('secretname').innerHTML = secretname;
  var shareLink = document.URL;
  shareLink = shareLink.replace(("?username=" + secretname), "");
  document.getElementById('share').value = shareLink;
  //document.getElementById('fullscreen').style.display="none";
  //document.getElementById('newRoom').style.display="none";
  if(PeerConnection) {
    rtc.createStream({
      "video": {"mandatory": {}, "optional": []},
      "audio": true
    }, function(stream) {
      //document.getElementById('you').src = URL.createObjectURL(stream);
      //document.getElementById('you').play();
      //document.getElementById('header').innerHTML=roomname;
      //videos.push(document.getElementById('you'));
      //rtc.attachStream(stream, 'you');
      //subdivideVideos();
    });
  } else {
    alert('Your browser is not supported or you have to turn on flags. In chrome you go to chrome://flags and turn on Enable PeerConnection remember to restart chrome');
  }


  var room = window.location.hash.slice(1);

  rtc.connect("ws:" + window.location.href.substring(window.location.protocol.length).split('#')[0], room);

  rtc.on('add remote stream', function(stream, socketId) {
    console.log("ADDING REMOTE STREAM...");
    var clone = cloneVideo('you', socketId);
    document.getElementById(clone.id).setAttribute("class", "");
    rtc.attachStream(stream, clone.id);
    subdivideVideos();
  });
  rtc.on('disconnect stream', function(data) {
    console.log('remove ' + data);
    removeVideo(data);
  });
  //initFullScreen();
  initNewRoom();
  initChat();
}

window.onresize = function(event) {
  subdivideVideos();
};