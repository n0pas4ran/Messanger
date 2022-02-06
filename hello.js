// <form action="" onsubmit="return handleSubmit();">
// 		<input type="text" id="chat-msg" />
// 		<input type="submit" value="sendid" />
// </form>
//
//
// onsubmit="return handleSubmit();"
var alphavitUp = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var alphavitLow = 'abcdefghijklmnopqrstuvwxyz';
var numbers = '0123456789';
var znaki = '!,./*-+=';

var temp1;
// var temp = msg[i];
// var temp1 = alphavit.indexOf(temp);
// if (temp1 != -1) {
// 	shifr += alphavit[25 - temp1];
// } else {
// 	shifr += ' ';
// }
function encoding(msg) {
  var shifr = "";
  for (var i = 0; i < msg.length; i++) {
    if (alphavitUp.indexOf(msg[i])!=-1){
			temp1 = alphavitUp.indexOf(msg[i])
			shifr += alphavitUp[25- temp1];
		}
		else if (alphavitLow.indexOf(msg[i])!=-1){
			temp1 = alphavitLow.indexOf(msg[i])
			shifr += alphavitLow[25- temp1];
		}
		else if (numbers.indexOf(msg[i])!=-1){
			temp1 = numbers.indexOf(msg[i])
			shifr += numbers[9- temp1];
		}
		else if (znaki.indexOf(msg[i])!=-1){
			temp1 = znaki.indexOf(msg[i])
			shifr += znaki[7 - temp1];
		}
		else{
			shifr+= ' ';
		}
  }
  return shifr;
}

function decoding(msg) {
  var shifr = "";
  for (var i = 0; i < msg.length; i++) {
    if (alphavitUp.indexOf(msg[i])!=-1){
			temp1 = alphavitUp.indexOf(msg[i])
			shifr += alphavitUp[25- temp1];
		}
		else if (alphavitLow.indexOf(msg[i])!=-1){
			temp1 = alphavitLow.indexOf(msg[i])
			shifr += alphavitLow[25- temp1];
		}
		else if (numbers.indexOf(msg[i])!=-1){
			temp1 = numbers.indexOf(msg[i])
			shifr += numbers[9- temp1];
		}
		else if (znaki.indexOf(msg[i])!=-1){
			temp1 = znaki.indexOf(msg[i])
			shifr += znaki[7 - temp1];
		}
		else{
			shifr+= ' ';
		}
  }
  return shifr;
}

console.log("Hello, my dear friend!");
console.log(encoding("Hello, my dear friend!"));
console.log(decoding("Svool+ nb wvzi uirvmw="));
