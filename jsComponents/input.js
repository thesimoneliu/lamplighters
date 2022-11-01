/* ------------------- INPUT CONTROLLERS ------------------- */

function createButtons() {
	push();
	// let newCanvas = newCanvasSize();
	// translate(newCanvas.x, newCanvas.y);
	readyButton = createButton("I'M READY!");
	startGameButton = createButton("Let's Go!");
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
		buttonList[i].position(
			170 * (size.width / canvasSize.width),
			300 * (size.height / canvasSize.height)
		);
		buttonList[i].style('textFont', fonts.rainyHeart);
		buttonList[i].style('background-color', COLORS.button_active);
		//buttonList[i].style('border-color', COLORS.button_border);
		buttonList[i].style('width', '200px');
		buttonList[i].style('height', '66px');
		buttonList[i].style('border-radius', '5px');
		buttonList[i].style('fontSize', '28px');
		buttonList[i].style('color', 'white');
		if (i === 1) {
			buttonList[i].mousePressed(() => {
				if (guests.length === 4) changeState();
			});
		} else {
			buttonList[i].mousePressed(changeState);
		}
	}

	pop();
}

function changeButtonStyle() {
	if (guests.length < 4) {
		startGameButton.style('background-color', COLORS.button_inactive); // inactive color
	} else if (guests.length === 4) {
		startGameButton.style('background-color', COLORS.button_active); // active color
	}
}

function hideButtons() {
	readyButton.hide();
	startGameButton.hide();
	restartButton_win.hide();
	restartButton_lose.hide();
}

function keyPressed() {
	// if hit wall play sfx
	// if (isWall(shared.gameState_Name, me.row, me.col - 1)) {
	// 	sounds.hitWall.play();
	// }
	if (
		keyCode === LEFT_ARROW &&
		!isWall(shared.gameState_Name, me.row, me.col - 1)
	) {
		me.col--;
		me.direction = 'left';
		console.log('left', me.row, me.col);
	} else if (
		keyCode === RIGHT_ARROW &&
		!isWall(shared.gameState_Name, me.row, me.col + 1)
	) {
		me.col++;
		me.direction = 'right';
		console.log('right', me.row, me.col);
	} else if (
		keyCode === UP_ARROW &&
		!isWall(shared.gameState_Name, me.row - 1, me.col)
	) {
		me.row--;
		me.direction = 'up';
		console.log('up', me.row, me.col);
	} else if (
		keyCode === DOWN_ARROW &&
		!isWall(shared.gameState_Name, me.row + 1, me.col)
	) {
		me.row++;
		me.direction = 'down';
		console.log('down', me.row, me.col);
	}
}

// function checkMovement() {
// 	if (
// 		(keyIsDown(LEFT_ARROW) || keyIsDown(65 /*a*/)) &&
// 		!isWall(me.row, me.col - 1)
// 	) {
// 		me.col--;
// 		me.direction = 'left';
// 		console.log('left', me.row, me.col);
// 	} else if (
// 		(keyIsDown(RIGHT_ARROW) || keyIsDown(68 /*d*/)) &&
// 		!isWall(me.row, me.col + 1)
// 	) {
// 		me.col++;
// 		me.direction = 'right';
// 		console.log('right', me.row, me.col);
// 	} else if (
// 		(keyIsDown(UP_ARROW) || keyIsDown(87 /*w*/)) &&
// 		!isWall(me.row - 1, me.col)
// 	) {
// 		me.row--;
// 		me.direction = 'up';
// 		console.log('up', me.row, me.col);
// 	} else if (
// 		(keyIsDown(DOWN_ARROW) || keyIsDown(83 /*s*/)) &&
// 		!isWall(me.row + 1, me.col)
// 	) {
// 		me.row++;
// 		me.direction = 'down';
// 		console.log('down', me.row, me.col);
// 	}
// }
