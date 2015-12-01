var b8 = require("./b8.js");
var acel = require("./b8_acel.js");
var awsIot = require('aws-iot-device-sdk');


var device_name = b8.cfg.clientId;

function fetchState(){
	var token = ts.get(device_name);
	console.log('Requested latest state ['+token+']')
}

function onConnect() {
	console.log('Device connected ['+device_name+']');
	ts.register( device_name );
	setTimeout(fetchState,2000);
}

function onDelta(thingName, shadow) {
	console.log("Delta received: "+ JSON.stringify(shadow));
	onDesiredState(shadow.state);
}

function onDesiredState(state){
	console.log("Updating desired state")
	console.log(state);
	b8.tell_fortune(state.l1,state.l2);
}

function onStatus(thingName, stat, token, shadow) {
	console.log('received status '+stat+' on '+thingName+': '+JSON.stringify(shadow));
	if ('accepted' == stat){
		onDesiredState(shadow.state.desired);
	}
}

function onTimeout(thingName, token) {
	console.log('received timeout '+token+" for "+thingName);
}

var ts = awsIot.thingShadow(b8.cfg);

ts.on('offline', function() {
	console.log('offline');
});

ts.on('error', function(error) {
	console.log('error', error);
});

ts.on('message', function(topic, payload) {
    console.log('message', topic, payload.toString());
});

ts.on('delta', onDelta);

ts.on('timeout', onTimeout);

ts.on('status', onStatus);

ts.on('connect', onConnect);

console.log("Done")