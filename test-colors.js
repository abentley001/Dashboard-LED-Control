var tinycolor = require('tinycolor2');
var ledColor = new tinycolor("hsv 0 100 100");

var i = 0

setInterval(() => {
  i++;
  ledColor.spin(i);
  console.log(i)
  console.log("red: ", ledColor._r);
  console.log("green: ", ledColor._g);
  console.log("blue: ", ledColor._b);
  ledColor.spin(-i);
  if (i > 359){
    i = 0;
  }
}, 20)
