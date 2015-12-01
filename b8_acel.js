var acl_lib   = require('jsupm_mma7660');

var acel = new acl_lib.MMA7660(
				acl_lib.MMA7660_I2C_BUS, 
				acl_lib.MMA7660_DEFAULT_I2C_ADDR);

acel.setModeStandby();
acel.setSampleRate(acl_lib.MMA7660.AUTOSLEEP_64);
acel.setModeActive();

var mvmt_limit = 10;

var x = acl_lib.new_intp();
var y = acl_lib.new_intp();
var z = acl_lib.new_intp();

var x0 = null;
var y0 = null;
var z0 = null;
var mvmt0 = null;

function poll(onMovement){
	function do_poll(){
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
			onMovement();
		}

		mvmt0 = mvmt1;
		console.log("mvmt ["+mvmt+"]");	
	}
	setInterval(do_poll,200); 
}

module.exports.poll = poll;
