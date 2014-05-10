<?php
if(isset($_POST['username'])){ $username = $_POST['username']; } 
echo ("
<html>
  <head>
    <title>Example webrtc.io</title>
    <meta id='secretname'>$username</meta>
    <link type='text/css' href='/style.css' rel='stylesheet'></link>
    <script src=/webrtc.io.js'></script>
  </head>
  <body onload='init()'>
    <h1 id='header'></h1>
    <div id='videos'>
      <video id='you' class='flip' autoplay width='263' height='200' style='position: absolute; left: 0px; bottom: 0px;''></video>
    </div>
    <div id='chatbox'>
      <div id='hideShowMessages' class='button'>toggle chat</div>
      <div id='messages'>
      </div>
      <input id='chatinput' type='text' placeholder='Message:'/>
    </div>

    <div class='buttonBox'>
      <div id='fullscreen' class='button'>Enter Full Screen</div>
      <div id='newRoom' class='button'>Create A New Room</div>
    </div>
    
    <script src='/script.js'></script>
  </body>
</html>
");

?>