/* ------------------- GAME STATE ------------------- */

/* ------------ state name: title ---------- */
function titleState() {
	push();
	//startscene images
	image(images.startBG, 0, 0, 400, 400);
	image(images.light, 0, 0, 400, 400);
	image(images.lamp, 60, 80, 280, 280);
	///buttons
	hideButtons();
	readyButton.show();
	pop();
}

/* ------------ state name: onboarding ---------- */
function onboardingState() {
	push();
	hideButtons();
	background(COLORS.bgColor_onboarding);
	// show the map
	image(images.mapDisplay_onboarding, 0, 0);
	// show other players
	drawAllPlayers();
	// show my avatar
	image(AVATAR[me.avatar][me.direction], me.xPos, me.yPos);
	// drawGrid();

	// text showing the number of players in room
	push();

	if (guests.length < 4) {
		textSize(16);
		// display how many players logged in
		fill(COLORS.intro_text);
		//text(guests.length, width / 2 - 95, 60);
		text(guests.length + ' /4', width / 2 - 100, 60);
		fill(COLORS.intro_caption);
		text('players in your team, waiting...', width / 2 - 70, 60);
	} else {
		// calculate how many players are at the gate
		calcPlayerAtGate();
		if (shared.playerAtGate < 4) {
			fill(COLORS.intro_caption);
			textSize(16);
			// display successful team
			text('Your team is built', width / 2 - 66, 50);
			text('Get to the exit together', width / 2 - 70, 62);
			text('You cannot win alone', width / 2 - 66, 74);

			// display how many players are at the gate
			fill(COLORS.intro_text);
			textSize(16);
			text(
				shared.playerAtGate + ' /4 players at the exit',
				width / 2 - 70,
				100
			);
		} else {
			fill(COLORS.intro_text);
			textSize(16);
			text('Your team made it to the exit!', width / 2 - 66, 82);
		}
	}
	pop();

	if (me.role === 'observer') {
		fill(COLORS.button_border);
		textSize(12);
		// display successful team
		text('[You are the observer]', width / 2, 380);
	}

	if (
		isGate(shared.gameState_Name, guests[0].row, guests[0].col) &&
		isGate(shared.gameState_Name, guests[1].row, guests[1].col) &&
		isGate(shared.gameState_Name, guests[2].row, guests[2].col) &&
		isGate(shared.gameState_Name, guests[3].row, guests[3].col)
	) {
		startGameButton.show();
		changeButtonStyle(); // change the status of startGameButton
	}
	pop();
}

/* ------------ state name: intro ---------- */
function introState() {
	shared.playerAtGate = PLAYER_AT_GATE;
	assignPosition();

	push();
	// intro images
	image(images.IntroBG, 0, 0, 400, 400);
	image(images.enterdoor, 100, 120, 200, 240);
	image(images.lampOil, 50, 155, 20, 20);
	image(images.clock, 240, 155, 20, 20);
	//buttons
	hideButtons();

	//title
	push();
	// textAlign(CENTER);
	fill('white');
	textFont(fonts.zero4);
	textSize(24);
	//fill(251,176,64);
	text('HOW TO PLAY', 80, 60);

	textSize(16);
	textFont(fonts.rainyHeart);
	fill(255);
	text('This is a 4-player game. To win the game, all', 50, 100);
	text('the players need to be at the door within the time', 50, 120);
	text("limit. Be each other's light!", 50, 140);
	text(': light scope+1', 80, 170);
	text(': time+20', 270, 170);
	pop();

	// countdown 10 seconds
	if (frameCount % 30 === 0) {
		shared.countdown_onBoarding--;
	}
	if (shared.countdown_onBoarding === 0) {
		changeState();
	}

	pop();
}

/* ------------ state name: main ---------- */
function mainState() {
	sounds.bgm.setVolume(0.8);
	push();
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
	image(images.mapDisplay_main, 0, 0);
	// show my avatar
	blendMode(BLEND);
	// show other players
	drawAllPlayers();
	image(AVATAR[me.avatar][me.direction], me.xPos, me.yPos);
	// drawGrid();
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
		isGate(shared.gameState_Name, guests[0].row, guests[0].col) &&
		isGate(shared.gameState_Name, guests[1].row, guests[1].col) &&
		isGate(shared.gameState_Name, guests[2].row, guests[2].col) &&
		isGate(shared.gameState_Name, guests[3].row, guests[3].col) &&
		shared.countdown > 0
	) {
		changeState('winning');
	} else if (shared.countdown <= 0) {
		changeState('losing');
	}
	// console.log(
	// 	isGate(shared.gameState_Name,guests[0].row, guests[0].col),
	// 	isGate(shared.gameState_Name,guests[1].row, guests[1].col),
	// 	isGate(shared.gameState_Name,guests[2].row, guests[2].col),
	// 	isGate(shared.gameState_Name,guests[3].row, guests[3].col)
	// );

	pop();

	/* -------------- UI Elements: Countdown & Score -------------- */
	push();
	textAlign(LEFT);
	textSize(16);
	fill(255);
	let countdownDisplay = 'TIME LEFT : ' + shared.countdown;
	text(countdownDisplay, 0, 16);
	let playerAtGateDisplay = 'PLAYERS AT THE GATE : ' + shared.playerAtGate;
	text(playerAtGateDisplay, 0, 32);
	textAlign(RIGHT);
	let scoreDisplay = 'LIGHT SCOPE: ' + shared.score;
	text(scoreDisplay, 400, 16);
	pop();

	/* -------------- UI Elements-old: Countdown & Score -------------- */
	// push();
	// textAlign(CENTER);
	// textSize(16 / SCALEX);
	// fill(255);
	// let countdownDisplay = 'TIME LEFT : ' + shared.countdown;
	// text(
	// 	countdownDisplay,
	// 	me.xPos - width / SCALEX / 3.5,
	// 	me.yPos - height / SCALEY / 3
	// );
	// let playerAtGateDisplay = 'PLAYERS AT THE GATE : ' + shared.playerAtGate;
	// text(
	// 	playerAtGateDisplay,
	// 	me.xPos + 20 - width / SCALEX / 3.5,
	// 	me.yPos + 15 - height / SCALEY / 3
	// );
	// let scoreDisplay = 'LIGHT SCOPE: ' + shared.score;
	// text(
	// 	scoreDisplay,
	// 	me.xPos - 30 + width / SCALEX / 2.5,
	// 	me.yPos - height / SCALEY / 3
	// );
	// pop();
}

/* ------------ state name: winning ---------- */
function winningState() {
	push();
	background(38, 32, 31);
	image(images.winBG, -10, 0);
	//sounds.win.play();

	push();
	fill('white');
	textFont(fonts.zero4);
	textSize(20);
	//fill(251,176,64);
	text('Congratulations!', 70, 60);
	text('you win!', 140, 100);
	pop();

	//buttons
	restartButton_win.show();
	//sounds.win.play();
	if (isGate(shared.gameState_Name, me.row, me.col)) {
		console.log('you win');
	}

	pop();
}

/* ------------ state name: losing --------- */
function losingState() {
	push();
	background(38, 32, 31);
	image(images.loseBG, 0, 0, 400, 400);
	push();
	fill('white');
	textFont(fonts.zero4);
	textSize(20);
	//fill(251,176,64);
	text('Oops!', 170, 60);
	text('Maybe next time!', 80, 100);
	pop();

	restartButton_lose.show();
	//sounds.lose.play();
	pop();
}
