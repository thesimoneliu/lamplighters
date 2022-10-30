/* ------------------- GAME STATE ------------------- */

/* ------------ state name: title ---------- */
function titleState() {
	push();
	image(images.startBG, 0, 0, 400, 400);
	hideButtons();
	readyButton.show();
	pop();
}

/* ------------ state name: intro ---------- */
function introState() {
	push();
	image(images.IntroBG, 0, 0, 400, 400);
	hideButtons();
	startGameButton.show();
	// background rect
	fill('#251F1E');
	noStroke();
	rect(135, 305, 130, 60);
	// text showing the number of players in room
	fill(COLORS.intro_text);
	textSize(16);
	text('PLAYERS: (' + guests.length + '/4) . . .', 200, 310);
	pop();
	changeButtonStyle(); // change the status of startGameButton
}

/* ------------ state name: main ---------- */
function mainState() {
	// setPosition();
	hideButtons();
	fill('white');

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

	blendMode(BLEND);
	// light the lamp
	lightenLamp();
	blendMode(MULTIPLY);
	// show the map
	image(images.mapDisplay, 0, 0);
	// show my avatar
	blendMode(BLEND);
	// show other players
	drawAllPlayers();
	image(AVATAR[me.avatar][me.direction], me.xPos, me.yPos);
	//drawGrid();
	// console.log(me.role, me.avatar, me.xPos, me.yPos);

	/* -------------- Objects -------------- */

	let gapTime_clock = int((millis() - gapTimeLastPickup_clock) / 1000);
	let gapTime_lampOil = int((millis() - gapTimeLastPickup_lampOil) / 1000);

	if (LAMP_OIL.status === 'hide' && gapTime_lampOil > LAMP_OIL.gapDuration) {
		console.log('show lamp', frameCount);
		let position = generateRandomPosition();
		// console.log(frameCount, position['row'],position['col']);
		LAMP_OIL._row = position['row'];
		LAMP_OIL._col = position['col'];
		LAMP_OIL.status = 'show';
	}
	if (LAMP_OIL.status === 'show') {
		if (!isLampOil(me.row, me.col)) {
			image(LAMP_OIL.img, LAMP_OIL._xPos(), LAMP_OIL._yPos());
		} else {
			sounds.pickup.play();
			shared.score++;
			lightRadius += 2;
			LAMP_OIL.status = 'hide';
			console.log('you picked up items!');
			gapTimeLastPickup_lampOil = millis();
		}
		// console.log(LAMP_OIL._row, LAMP_OIL._col, isLampOil(me.row, me.col));
	}

	if (CLOCK.status === 'hide' && gapTime_clock > CLOCK.gapDuration) {
		let position = generateRandomPosition();
		CLOCK._row = position['row'];
		CLOCK._col = position['col'];
		CLOCK.status = 'show';
	}
	if (CLOCK.status === 'show') {
		if (!isClock(me.row, me.col)) {
			image(CLOCK.img, CLOCK._xPos(), CLOCK._yPos());
		} else {
			sounds.pickup.play();
			shared.countdown += CLOCK.workingDuration;
			CLOCK.status = 'hide';
			console.log('you picked up a clock!');
			gapTimeLastPickup_clock = millis();
		}
	}

	/* -------------- WIN & LOSE STATE -------------- */
	// set countdown reduction
	if (frameCount % 10 === 0 && shared.countdown > 0) {
		shared.countdown--;
	}

	// calculate how many players are at the gate
	calcPlayerAtGate();

	// change all players' state based on countdown value
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
	let playerAtGateDisplay = 'PLAYERS AT THE GATE : ' + shared.playerAtGate;
	text(
		playerAtGateDisplay,
		me.xPos + 20 - width / SCALEX / 3.5,
		me.yPos + 15 - height / SCALEY / 3
	);
	let scoreDisplay = 'LIGHT SCOPE: ' + shared.score;
	text(
		scoreDisplay,
		me.xPos - 30 + width / SCALEX / 2.5,
		me.yPos - height / SCALEY / 3
	);
	pop();
}

/* ------------ state name: winning ---------- */
function winningState() {
	image(images.winBG, 0, 0, 400, 400);
	image(images.winGateGIF, -10, 0);
	restartButton_win.show();
	sounds.win.play();
	if (isGate(me.row, me.col)) {
		console.log('you win');
	}
}

/* ------------ state name: losing --------- */
function losingState() {
	image(images.loseBG, 0, 0, 400, 400);
	// image(images.loseGIF, -10, 0);
	restartButton_lose.show();
	sounds.lose.play();
}
