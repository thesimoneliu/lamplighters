let readyButton, startGameButton, restartButton_win,restartButton_lose;

function setup(){
	canvas = createCanvas(canvasSize.width, canvasSize.height);
	canvas.parent('canvas-wrap');

    createButtons();
}


function createButtons() {
	push();
	//let newCanvas = newCanvasSize();
	// translate(newCanvas.x, newCanvas.y);
	readyButton = createButton("I'M READY!");
	startGameButton = createButton('Let\'s Go!');
	restartButton_win = createButton('RESTART');
	restartButton_lose = createButton('TRY AGAIN');

	let buttonList = [
		readyButton,
		startGameButton,
		restartButton_win,
		restartButton_lose,
	];

	for (let i = 0; i < 4; i++) {
		buttonList[i].parent('canvas-wrap');
		if (i === 1) {
			buttonList[i].position(116, 324);
		} else {
			buttonList[i].position(110,324);
		}
		buttonList[i].style('background-color',COLORS.button_active);
		buttonList[i].style('border-color',COLORS.button_border);
		buttonList[i].style('width', '180px');
		buttonList[i].style('height', '50px');
		buttonList[i].style('border-radius','5px');
		buttonList[i].style('fontSize','28px');
		buttonList[i].style('color', 'white');
		// if (i === 1) {
		// 	buttonList[i].mousePressed(() => {
		// 		if (guests.length === 4) changeState();
		// 	});
		// } else {
		// 	buttonList[i].mousePressed(changeState);
		// }
	}

	pop();
}