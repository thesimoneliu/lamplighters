/* ------------------- INPUT CONTROLLERS ------------------- */

function createButtons() {
	readyButton = createButton("I'M READY!");
	readyButton.addClass('actionButton');
	readyButton.position(210, 490);
	readyButton.style('background-color: #CF6831');
	readyButton.mousePressed(changeState);

	startGameButton = createButton('START');
	startGameButton.addClass('actionButton');
	startGameButton.position(220, 490);
	startGameButton.mousePressed(() => {
		if (guests.length === 4) changeState();
	});

	restartButton_win = createButton('RESTART');
	restartButton_win.addClass('actionButton');
	restartButton_win.position(210, 490);
	restartButton_win.style('background-color: #CF6831');
	restartButton_win.mousePressed(restart);

	restartButton_lose = createButton('TRY AGAIN');
	restartButton_lose.addClass('actionButton');
	restartButton_lose.position(210, 490);
	restartButton_lose.style('background-color: #CF6831');
	restartButton_lose.mousePressed(restart);
}

function changeButtonStyle() {
	if (guests.length < 4) {
		startGameButton.style('background-color: #F8C6AB'); // inactive color
	} else if (guests.length === 4) {
		startGameButton.style('background-color: #CF6831'); // active color
	}
}

function hideButtons() {
	readyButton.hide();
	startGameButton.hide();
	restartButton_win.hide();
	restartButton_lose.hide();
}

function keyPressed() {
	if (keyCode === LEFT_ARROW && !isWall(me.row, me.col - 1)) {
		me.col--;
		me.direction = 'left';
		// console.log('left', me.row, me.col);
	} else if (keyCode === RIGHT_ARROW && !isWall(me.row, me.col + 1)) {
		me.col++;
		me.direction = 'right';
		// console.log('right', me.row, me.col);
	} else if (keyCode === UP_ARROW && !isWall(me.row - 1, me.col)) {
		me.row--;
		me.direction = 'up';
		// console.log('up', me.row, me.col);
	} else if (keyCode === DOWN_ARROW && !isWall(me.row + 1, me.col)) {
		me.row++;
		me.direction = 'down';
		// console.log('down', me.row, me.col);
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
