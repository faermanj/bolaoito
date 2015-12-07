var lcd = require("./b8_lcd.js");

cfg = {
	privateKey:'./private.key',
	clientCert:'./certificate.pem',
	caCert:'./rootCA.pem',
	clientId:'b8-client',
	region:'us-east-1',
	reconnectPeriod:'10'
}

function prompt(){
	lcd.write("foca na","pergunta")
}

function tell_fortune(l1,l2){
	lcd.write(l1,l2); 
    setTimeout(prompt,3000);
}

prompt();
module.exports.cfg = cfg;
module.exports.tell_fortune = tell_fortune;
