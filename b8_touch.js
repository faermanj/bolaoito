var touch_lib = require('jsupm_ttp223');
var touch = new touch_lib.TTP223(2);

var touched = false;

function chk_touch(onTouch) {
    var isTouched = touch.isPressed();
    if ( isTouched ) {
        if(! touched){
        	onTouch();
        	touched = true;
        }
    }
    touched = isTouched;
    //console.log("Touched ["+touched+"/"+isTouched+"]");
}

function poll(onTouch){
	//console.log("Start polling touch");
	setInterval(function(){
		chk_touch(onTouch);
	}, 500);
}

module.exports.poll = poll;

