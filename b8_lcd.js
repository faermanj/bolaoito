var lcd_lib   = require ('jsupm_i2clcd');

var lcd   = new lcd_lib.Jhd1313m1(6, 0x3E, 0x62);

function lcd_pad(str){
	if (! str) return lcd_pad(" ");
	if (str.length >= 16) return str.substr(0,16);
	else return lcd_pad(str+" ");
}

function write(l1,l2){
	var ll1 = lcd_pad(l1);
	var ll2 = lcd_pad(l2);
	console.log("+----------------+")
	console.log("|"+ll1+"|")
	console.log("|"+ll2+"|")
	console.log("+----------------+")
	lcd.setCursor(0,0);
    lcd.write(ll1);
	lcd.setCursor(1,0);
    lcd.write(ll2);
}

module.exports.write = write;
