var b8 = require("./b8.js");
var acel = require("./b8_acel.js");
var awsIot = require('aws-iot-device-sdk');


var device_name = b8.cfg.clientId;

var cbs = {};

var clientTokenUpdate;
function update() {
	console.log("Updating state "+ JSON.stringify(b8_state));
	clientTokenUpdate = ts.update(device_name, b8_state );
}

function withToken(token,fn){
	console.log('cb['+token+'] requested');
	cbs[token] = fn;
}

function tell(shadow){
	var l1 = shadow.state.l1;
	var l2 = shadow.state.l2; 
	b8.tell_fortune(l1,l2);
}

function onConnect() {
	console.log('device connected ['+device_name+'] ');
	ts.register( device_name );
	var token = ts.get(device_name);
	withToken(token,tell);
}

function onDelta(thingName, shadow) {
	console.log("Delta received: "+ JSON.stringify(state));
	var state = shadow.state;
	var l1 = state.l1;
	var l2 = state.l2;
	b8.tell_fortune(l1,l2);
	b8_state = state;
}

function onStatus(thingName, stat, token, stateObject) {
	console.log('received status '+stat+' on '+thingName+': '+JSON.stringify(stateObject));
	var fn = cbs[token];
	console.log('cb['+token+'] => ');
	if(fn) fn(shadow);
	cbs[token] = null;
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