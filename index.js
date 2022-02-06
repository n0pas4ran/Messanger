window.ws = new WebSocket('ws://' + location.host + '/ws');
var alphavitUp = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var alphavitLow = 'abcdefghijklmnopqrstuvwxyz';
var numbers = '0123456789';
var znaki = '!,./*-+=?:();';
var tempMsg = '';
var flag_bot = 0;

function sendMessage(msg) {
   var len = '' + msg.length;
   while (len.length < 5) len += ' ';

   ws.send(len + msg);

}


function handleSubmit() {
   var el = document.getElementById('chat-msg');
   var temp = encoding(el.value);

   tempMsg = el.value;
   sendMessage(temp);
   flag_bot = 1;
   el.value = '';
   return false;
}

function encoding(msg) {
   var shifr = "";
   for (var i = 0; i < msg.length; i++) {
      if (alphavitUp.indexOf(msg[i]) != -1) {
         temp1 = alphavitUp.indexOf(msg[i])
         shifr += alphavitUp[25 - temp1];
      } else if (alphavitLow.indexOf(msg[i]) != -1) {
         temp1 = alphavitLow.indexOf(msg[i])
         shifr += alphavitLow[25 - temp1];
      } else if (numbers.indexOf(msg[i]) != -1) {
         temp1 = numbers.indexOf(msg[i])
         shifr += numbers[9 - temp1];
      } else if (znaki.indexOf(msg[i]) != -1) {
         temp1 = znaki.indexOf(msg[i])
         shifr += znaki[12 - temp1];
      } else {
         shifr += ' ';
      }
   }
   return shifr;
}

function decoding(msg) {
   var shifr = "";
   for (var i = 0; i < msg.length; i++) {
      if (alphavitUp.indexOf(msg[i]) != -1) {
         temp1 = alphavitUp.indexOf(msg[i])
         shifr += alphavitUp[25 - temp1];
      } else if (alphavitLow.indexOf(msg[i]) != -1) {
         temp1 = alphavitLow.indexOf(msg[i])
         shifr += alphavitLow[25 - temp1];
      } else if (numbers.indexOf(msg[i]) != -1) {
         temp1 = numbers.indexOf(msg[i])
         shifr += numbers[9 - temp1];
      } else if (znaki.indexOf(msg[i]) != -1) {
         temp1 = znaki.indexOf(msg[i])
         shifr += znaki[12 - temp1];
      } else {
         shifr += ' ';
      }
   }
   return shifr;
}



function setUpSocket(onmessage) {

   ws.onopen = function () {
      console.log('Соединение установлено...');

   }
   ws.onclose = function (event) {
      if (event.wasClean) {
         console.log('Connection closed');
      } else {
         console.log('error: connection reset');
         console.log('Code: ' + event.code + 'reason: ' + event.reason);
      }
   }
   ws.onmessage = onmessage;
   ws.onerror = function (error) {
      console.log('Error ' + error.message);
   }

}

function displayMessage(message) {
   var container = document.getElementById('container');
   var div = document.createElement('div');
   if (message.data.length <= 0) {
      return;
   }
   var temp = decoding(message.data);
   if (temp != tempMsg) {
      div.className = 'messageIn';
      var textNode = document.createTextNode(temp);
      div.appendChild(textNode);

      container.insertBefore(div, container.firstChild);
   } else {
      div.className = 'messageOut';
      var textNode = document.createTextNode(temp);
      div.appendChild(textNode);
      container.insertBefore(div, container.firstChild);
   }
}

