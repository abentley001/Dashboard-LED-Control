//Adding Comment to test Git
//Adding second Comment

var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
var Gpio = require('pigpio').Gpio, //include pigpio to interact with the GPIO
ledRed = new Gpio(4, {mode: Gpio.OUTPUT}), //use GPIO pin 4 as output for RED
ledGreen = new Gpio(5, {mode: Gpio.OUTPUT}), //use GPIO pin 17 as output for GREEN
ledBlue = new Gpio(6, {mode: Gpio.OUTPUT}), //use GPIO pin 27 as output for BLUE
redRGB = 0, //set starting value of RED variable to off (255 for common anode)
greenRGB = 0, //set starting value of GREEN variable to off (255 for common anode)
blueRGB = 0; //set starting value of BLUE variable to off (255 for common anode)

//RESET RGB LED
ledRed.digitalWrite(0); // Turn RED LED off
ledGreen.digitalWrite(0); // Turn GREEN LED off
ledBlue.digitalWrite(0); // Turn BLUE LED off

http.listen(8080); //listen to port 8080

var fadeTime = 500;

var redTimeout;

function fadeRed (newRed){
	var speed = (fadeTime / Math.abs(redRGB - newRed))
	if (redTimeout){
		redTimeout = clearTimeout(redTimeout);
	}
	redTimeout = setTimeout(
		function (){
			if (redRGB < newRed){
				redRGB++;
				fadeRed(newRed);
			}
			if (redRGB > newRed){
				redRGB--;
				fadeRed(newRed);
			}
		console.log(redRGB);
 		ledRed.pwmWrite(redRGB);
	}, speed)
}

var greenTimeout;

function fadeGreen (newGreen){
	var speed = (fadeTime / Math.abs(greenRGB - newGreen))
	if (greenTimeout){
		greenTimeout = clearTimeout(greenTimeout);
	}
	greenTimeout = setTimeout(
		function (){
			if (greenRGB < newGreen){
				greenRGB++;
				fadeGreen(newGreen);
			}
			if (greenRGB > newGreen){
				greenRGB--;
				fadeGreen(newGreen);
			}
		console.log(greenRGB);
 		ledGreen.pwmWrite(greenRGB);
	}, speed)
}

var blueTimeout;

function fadeBlue (newBlue){
	var speed = (fadeTime / Math.abs(blueRGB - newBlue))
	if (blueTimeout){
		blueTimeout = clearTimeout(blueTimeout);
	}
	blueTimeout = setTimeout(
		function (){
			if (blueRGB < newBlue){
				blueRGB++;
				fadeBlue(newBlue);
			}
			if (blueRGB > newBlue){
				blueRGB--;
				fadeBlue(newBlue);
			}
		console.log(blueRGB);
 		ledBlue.pwmWrite(blueRGB);
	}, speed)
}
function handler (req, res) { //what to do on requests to port 8080
    //console.log('handler', req.body);
    req.on('data', function (data) {
        console.log('request data', data.toString())
	var color = JSON.parse(data.toString());
	fadeRed(parseInt(color.red));
	fadeGreen(parseInt(color.green));
	fadeBlue(parseInt(color.blue));
        //set RED LED to specified value
        ledGreen.pwmWrite(greenRGB); //set GREEN LED to specified value
        ledBlue.pwmWrite(blueRGB); //set BLUE LED to specified value
    })
    fs.readFile(__dirname + '/public/rgb.html', function(err, data) { //read file rgb.html in public folder
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
      return res.end("404 Not Found");
    }
    res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
    res.write(data); //write data from rgb.html
    return res.end();
  });
}

io.sockets.on('connection', function (socket) {// Web Socket Connection
  socket.on('rgbLed', function(data) { //get light switch status from client
    console.log('socket log ', data); //output data from WebSocket connection to console

    //for common anode RGB LED  255 is fully off, and 0 is fully on, so we have to change the value from the client
    redRGB=parseInt(data.red);
    greenRGB=parseInt(data.green);
    blueRGB=parseInt(data.blue);

    console.log("rbg: " + redRGB + ", " + greenRGB + ", " + blueRGB); //output converted to console

    ledRed.pwmWrite(redRGB); //set RED LED to specified value
    ledGreen.pwmWrite(greenRGB); //set GREEN LED to specified value
    ledBlue.pwmWrite(blueRGB); //set BLUE LED to specified value
  });
});

process.on('SIGINT', function () { //on ctrl+c
  ledRed.digitalWrite(0); // Turn RED LED off
  ledGreen.digitalWrite(0); // Turn GREEN LED off
  ledBlue.digitalWrite(0); // Turn BLUE LED off
  process.exit(); //exit completely
});
