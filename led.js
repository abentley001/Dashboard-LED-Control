var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var tinycolor = require('tinycolor2');

var Gpio = require('pigpio').Gpio; //include pigpio to interact with the GPIO
var gpiRed = new Gpio(4, {mode: Gpio.OUTPUT}); //use GPIO pin 4 as output for RED
var gpiGreen = new Gpio(5, {mode: Gpio.OUTPUT}); //use GPIO pin 29 as output for GREEN
var gpiBlue = new Gpio(6, {mode: Gpio.OUTPUT}); //use GPIO pin 31 as output for BLUE
var gpiWarmWhite = new Gpio(13, {mode: Gpio.OUTPUT}); //use GPIO pin 33 as output for WARM WHITE
var gpiCoolWhite = new Gpio(26, {mode: Gpio.OUTPUT}); //use GPIO pin 37 as output for COOL WHITE
var vegasMode;

var ledColor = tinycolor("hsv 0 100 100");
var i = 0;
//RESET RGB LED
gpiRed.digitalWrite(0); // Turn RED LED off
gpiGreen.digitalWrite(0); // Turn GREEN LED off
gpiBlue.digitalWrite(0); // Turn BLUE LED off
gpiWarmWhite.digitalWrite(0); // Turn WARM WHITE LED off
gpiCoolWhite.digitalWrite(0); // Turn COOL WHITE LED off




http.listen(8080); //listen to port 8080


function handler (req, res) { //what to do on requests to port 8080
    //console.log('handler', req.body);
    req.on('data', function (json) {

			console.log('request data', json.toString())

			var data = JSON.parse(json.toString());

			if (data.vegasMode == false && vegasMode){
				vegasMode = clearInterval(vegasMode)
			}

			if (data.vegasMode == true && !vegasMode) {
				console.log ('yayyy');
				vegasMode = setInterval(() => {
				  i++;
				  ledColor.spin(i);
					gpiRed.pwmWrite(Math.round(ledColor._r));
					gpiGreen.pwmWrite(Math.round(ledColor._g));
					gpiBlue.pwmWrite(Math.round(ledColor._b));
				  ledColor.spin(-i);
				  if (i > 359){
				    i = 0;
				  }
				}, 10);
			}

			if ('red' in data) {
				gpiRed.pwmWrite((parseInt(data.red)));
				gpiGreen.pwmWrite((parseInt(data.green)));
				gpiBlue.pwmWrite((parseInt(data.blue)));
			}

			if ('warmWhite' in data) {
				gpiWarmWhite.pwmWrite((parseInt(data.warmWhite)));
				gpiCoolWhite.pwmWrite((parseInt(data.coolWhite)));
			}




		})
    return res.end();
  }

process.on('SIGINT', function () { //on ctrl+c
  gpiRed.digitalWrite(0); // Turn RED LED off
  gpiGreen.digitalWrite(0); // Turn GREEN LED off
  gpiBlue.digitalWrite(0); // Turn BLUE LED off
  gpiWarmWhite.digitalWrite(0); // Turn WARM WHITE LED off
  gpiCoolWhite.digitalWrite(0); // Turn COOL WHITE LED off
  process.exit(); //exit completely
});
