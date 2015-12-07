var b8 = require("./b8.js")
var lcd = require("./b8_lcd.js");
var touch = require("./b8_touch.js");

var awsIot = require('aws-iot-device-sdk');

var outTopic = "8ball_topic";
var inTopic  = "8ball_fortune";

var last_ask  = new Date().getTime();
var ask_limit = 1000;

var device = awsIot.device(b8.cfg);

device.on('connect', function() {
    console.log('device connected!');
    device.subscribe(inTopic);
    touch.poll(ask_fortune)
});

device.on('message', function(topic, payload) {
	var state = JSON.parse(payload.toString());
	var fortune = ""+state.fortune;
    console.log('message received! '+ fortune);
    b8.tell_fortune(fortune);
});

function ask_fortune(){
	var ask_time = new Date().getTime();
	if (ask_time - last_ask > ask_limit){		
		last_ask = ask_time;
		var state = {};
		device.publish(outTopic, JSON.stringify(state));
		console.log("Consulting clouds...");	
	}else {
		console.log("Calma...")
	} 	
}

console.log("Pronto!");
