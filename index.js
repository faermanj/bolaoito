// Javascript UPM bindings
var lcd_lib   = require ('jsupm_i2clcd');
var acl_lib   = require('jsupm_mma7660');

// Init Components
var lcd   = new lcd_lib.Jhd1313m1(6, 0x3E, 0x62);
var acel = new acl_lib.MMA7660(
				acl_lib.MMA7660_I2C_BUS, 
				acl_lib.MMA7660_DEFAULT_I2C_ADDR);

acel.setModeStandby();
acel.setSampleRate(acl_lib.MMA7660.AUTOSLEEP_64);
acel.setModeActive();

var x = acl_lib.new_intp();
var y = acl_lib.new_intp();
var z = acl_lib.new_intp();

//Connect to AWS IoT
var awsIot = require('aws-iot-device-sdk');

// Config Params
var aiot_auth = {
	privateKey:'/home/root/intelmaker/e38b7af54b-private.pem.key',
	clientCert:'/home/root/intelmaker/e38b7af54b-certificate.pem.crt',
	caCert:'/home/root/intelmaker/rootCA.pem',
	clientId:'bolaoito-client',
	region:'us-east-1',
	reconnectPeriod:'10'
} 

var device_name = 'bolaoito-device';
var outTopic = "8ball_topic";
var inTopic  = "8ball_fortune";
var mvmt_limit = 10;
var last_ask  = new Date().getTime();
var ask_limit = 1000;

// Program State
var x0 = null;
var y0 = null;
var z0 = null;
var mvmt0 = null;

// Program Code
var device = awsIot.device(aiot_auth);

device.on('connect', function() {
    log('device connected!');
    device.subscribe(inTopic);
    setInterval(poll,100);
});

device.on('message', function(topic, payload) {
	var state = JSON.parse(payload.toString());
	var fortune = ""+state.fortune;
    log('message received! '+ fortune);
    lcd_write(fortune); 
});

function ask_fortune(){
	log("asking...");
	device.publish(outTopic, JSON.stringify({ press: 1 }));
}

function poll(){
	acel.getRawValues(x, y, z);
	var x1 = acl_lib.intp_value(x);
	var y1 = acl_lib.intp_value(y);
	var z1 = acl_lib.intp_value(z);

	var xd = Math.abs(x1-x0);
	var yd = Math.abs(y1-y0);
	var zd = Math.abs(z1-z0);

	var mvmt1 = xd + yd + zd;
	if (mvmt0 == null){
		mvmt0 = mvmt1;
	}

	var mvmt = Math.abs(mvmt1-mvmt0)
	if (mvmt > mvmt_limit){
		var ask_time = new Date().getTime();
		if (ask_time - last_ask > ask_limit){
			last_ask = ask_time;
			ask_fortune();
		}
	}

	mvmt0 = mvmt1;
	log("mvmt ["+mvmt+"]");	
}

function lcd_write(message){
	var l1 = message.substr(0,16);
	var l2 = message.substr(16,32);
	lcd.setCursor(0,0);
    lcd.write(l1);
	lcd.setCursor(1,0);
    lcd.write(l2);
}

function log(message){
	console.log(message);
}

log("Pronto!");
lcd_write("0123456789ABCDEF0123456789ABCDEF");