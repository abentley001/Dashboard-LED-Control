var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var io = require('socket.io')(http); //require socket.io module and pass the http object (server)
var tinycolor = require('tinycolor2');

var Gpio = require('pigpio').Gpio; //include pigpio to interact with the GPIO
var gpiRed = new Gpio(4, {mode: Gpio.OUTPUT}); //use GPIO pin 4 as output for RED
var gpiGreen = new Gpio(5, {mode: Gpio.OUTPUT}); //use GPIO pin 17 as output for GREEN
var gpiBlue = new Gpio(6, {mode: Gpio.OUTPUT}); //use GPIO pin 27 as output for BLUE

var ledColor = tinycolor("hsv 0 100 100");
var i = 0;
//RESET RGB LED
gpiRed.digitalWrite(0); // Turn RED LED off
gpiGreen.digitalWrite(0); // Turn GREEN LED off
gpiBlue.digitalWrite(0); // Turn BLUE LED off

setInterval(() => {
  i++;
  ledColor.spin(i);
	gpiRed.pwmWrite(Math.round(ledColor._r)); // Turn RED LED off
	gpiGreen.pwmWrite(Math.round(ledColor._g)); // Turn GREEN LED off
	gpiBlue.pwmWrite(Math.round(ledColor._b));
	console.log(ledColor._r); // Turn RED LED off
	console.log(ledColor._g); // Turn GREEN LED off
	console.log(ledColor._b);
  ledColor.spin(-i);
  if (i > 359){
    i = 0;
  }
}, 10)


http.listen(8080); //listen to port 8080


function handler (req, res) { //what to do on requests to port 8080
    //console.log('handler', req.body);
    req.on('data', function (data) {
        console.log('request data', data.toString())
	var color = JSON.parse(data.toString());
        gpiRed.pwmWrite((parseInt(color.red))); //set RED LED to specified value
        gpiGreen.pwmWrite((parseInt(color.green))); //set GREEN LED to specified value
        gpiBlue.pwmWrite((parseInt(color.blue))); //set BLUE LED to specified value
    })
    return res.end();
  }

io.sockets.on('connection', function (socket) {// Web Socket Connection
  socket.on('rgbLed', function(data) { //get light switch status from client
    console.log('socket log ', data); //output data from WebSocket connection to console

    //for common anode RGB LED  255 is fully off, and 0 is fully on, so we have to change the value from the client
    redRGB=parseInt(data.red);
    greenRGB=parseInt(data.green);
    blueRGB=parseInt(data.blue);

    console.log("rbg: " + redRGB + ", " + greenRGB + ", " + blueRGB); //output converted to console

    gpiRed.pwmWrite(redRGB); //set RED LED to specified value
    gpiGreen.pwmWrite(greenRGB); //set GREEN LED to specified value
    gpiBlue.pwmWrite(blueRGB); //set BLUE LED to specified value
  });
});

process.on('SIGINT', function () { //on ctrl+c
  gpiRed.digitalWrite(0); // Turn RED LED off
  gpiGreen.digitalWrite(0); // Turn GREEN LED off
  gpiBlue.digitalWrite(0); // Turn BLUE LED off
  process.exit(); //exit completely
});
