var lcd = require("./b8_lcd.js");
var lcd = require("./b8_lcd.js");


cfg = {
	privateKey:'/home/root/e38b7af54b-private.pem.key',
	clientCert:'/home/root/e38b7af54b-certificate.pem.crt',
	caCert:'/home/root/rootCA.pem',
	clientId:'intelmaker-edison',
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
