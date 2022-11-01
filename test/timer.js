let countdown = 20;
let origin_timer;

function setup() {
	//frameRate(30);
	origin_timer = millis();
}
function draw() {
	if (countdown > 0) {
		if (frameCount % 30 === 0) {
			// countdown -= int((millis() - origin_timer) / 1000);
            countdown --;
			let countdownDisplay = countdown + 's left to enter the gate';
			console.log(countdownDisplay);
		}
	} else if (countdown === 0) {
		console.log('changestate');
	}
}
