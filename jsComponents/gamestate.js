/* ------------------- GAME STATE ------------------- */

/* ------------ state name: title ---------- */
function titleState() {
	image(images.startBG, 0, 0, 400, 400);
	hideButtons();
	readyButton.show();
	// background rect
	fill('#251F1E');
	noStroke();
	rect(135, 325, 130, 40);
}

/* ------------ state name: intro ---------- */
function introState() {
	image(images.IntroBG, 0, 0, 400, 400);
	hideButtons();
	startGameButton.show();
	// background rect
	fill('#251F1E');
	noStroke();
	rect(135, 305, 130, 60);
	// text showing the number of players in room
	fill(251, 176, 64);
	textSize(16);
	text('PLAYERS: (' + guests.length + '/4) . . .', 200, 310);
	changeButtonStyle(); // change the status of startGameButton
}

/* ------------ state name: main ---------- */
function mainState() {
	// setPosition();
	hideButtons();

	// update my x and y position from keypressed
	me.xPos = me.col * GRID_SIZE;
	me.yPos = me.row * GRID_SIZE;

	cameraMovement();
	//checkMovement();
	// set camera transform
	scale(SCALEX, SCALEY);
	translate(-mainCamera.x, -mainCamera.y);
	translate(
		width / 2 / SCALEX - GRID_SIZE / 2,
		height / 2 / SCALEY - GRID_SIZE / 2
	);

	// show other players
	drawAllPlayers();

	blendMode(BLEND);
	// light the lamp
	lightenLamp();
	blendMode(MULTIPLY);
	// show the map
	image(images.mapDisplay, 0, 0);
	// show my avatar
	blendMode(BLEND);
	image(AVATAR[me.avatar][me.direction], me.xPos, me.yPos);
	// drawGrid();
	// console.log(me.role, me.avatar, me.xPos, me.yPos);

	/* -------------- Objects -------------- */

	// let position = generateRandomNum();
	// if (position) {
	// 	if (frameCount % 65 === 0 && shared.countdown > 0) {
	// 		shared.clock.xPos = position.xPos;
	// 		shared.clock.yPos = position.yPos;
	// 		image(shared.clock.img, shared.clock.xPos, shared.clock.yPos);
	// 	}
	// 	if (frameCount % 30 === 0 && shared.countdown > 0) {
	// 		shared.lampOil.xPos = position.xPos;
	// 		shared.lampOil.yPos = position.yPos;
	// 		image(shared.lampOil.img, shared.lampOil.xPos, shared.lampOil.yPos);
	// 	}
	// }

	// generate clock at a random position
	if (frameCount % 30 === 0 && shared.countdown > 0) {
		let position = generateRandomNum();
		console.log(position);
		console.log(typeof position !== 'undefined');
		if (typeof position !== 'undefined') {
			console.log("yes there's value passed to position");
			shared.clock.xPos = position.xPos;
			shared.clock.yPos = position.yPos;
			// image(shared.clock.img, shared.clock.xPos, shared.clock.yPos);
		}
	}

	for (let i = 0; i < PLAYER_NUM_LIMIT; i++) {
		if (i < guests.length) {
			if (isClock(guests[i].row, guests[i].col)) {
				shared.clock.xPos = 0;
				shared.clock.yPos = 0;
				shared.countdown += 15;
			}
			if (isLampOil(guests[i].row, guests[i].col)) {
				shared.lampOil.xPos = 0;
				shared.lampOil.yPos = 0;
				let currentTime = frameCount;

				ellipse(
					guests[j].xPos + 4,
					guests[j].yPos + 4,
					LIGHT_RADIUS * 5 + sin(second()*3),
					LIGHT_RADIUS * 5 + sin(second()*3)
				  );
				
			}
		}
	}

	/* -------------- WIN & LOSE STATE -------------- */
	// set countdown reduction
	if (frameCount % 10 === 0 && shared.countdown > 0) {
		shared.countdown--;
	}
	// change state based on countdown value
	if (
		isGate(guests[0].row, guests[0].col) &&
		isGate(guests[1].row, guests[1].col) &&
		isGate(guests[2].row, guests[2].col) &&
		isGate(guests[3].row, guests[3].col) &&
		shared.countdown > 0
	) {
		changeState('winning');
	} else if (shared.countdown <= 0) {
		changeState('losing');
	}
	// console.log(
	// 	isGate(guests[0].row, guests[0].col),
	// 	isGate(guests[1].row, guests[1].col),
	// 	isGate(guests[2].row, guests[2].col),
	// 	isGate(guests[3].row, guests[3].col)
	// );

	/* -------------- UI Elements: Countdown & Score -------------- */
	push();
	textAlign(CENTER);
	textSize(16 / SCALEX);
	fill(255);
	let countdownDisplay = 'TIME LEFT : ' + shared.countdown;
	text(
		countdownDisplay,
		me.xPos - width / SCALEX / 3.5,
		me.yPos - height / SCALEY / 3
	);
	let scoreDisplay = 'SCORE : ' + shared.score;
	text(
		scoreDisplay,
		me.xPos + width / SCALEX / 2.5,
		me.yPos - height / SCALEY / 3
	);
	pop();
}

/* ------------ state name: winning ---------- */
function winningState() {
	image(images.winBG, 0, 0, 400, 400);
	image(images.winGateGIF, -10, 0);
	restartButton_win.show();
	// background rect
	fill('#251F1E');
	noStroke();
	rect(135, 305, 140, 60);

	if (isGate(me.row, me.col)) {
		console.log('you win');
	}
}

/* ------------ state name: losing --------- */
function losingState() {
	image(images.loseBG, 0, 0, 400, 400);
	// image(images.loseGIF, -10, 0);
	restartButton_lose.show();
	// background rect
	fill('#251F1E');
	noStroke();
	rect(135, 305, 140, 80);
}
