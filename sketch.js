/*
reference: 
https://p5party.netlify.app/examples/d12/

collision demo: https://editor.p5js.org/jbakse/sketches/566J1LPcI
player role demo: https://p5party.netlify.app/examples/pong/
mask: https://editor.p5js.org/ximinliu/sketches/BGMwM3vClD
timer: https://p5party.netlify.app/examples/timer/
pixel: https://p5party.netlify.app/examples/frogs/
animation: see example

*/

function preload() {
	partyConnect(
		'wss://deepstream-server-1.herokuapp.com',
		'Lamplighters_ver4.0_final_1101',
		'main1'
	);

	shared = partyLoadShared('globals'); // load shared
	guests = partyLoadGuestShareds(); // load guests data
	me = partyLoadMyShared({
		// load my data
		role: 'observer',
		row: 3,
		col: 4,
		avatar: 0,
		nearbyPlayer: [0, 0, 0, 0],
		direction: 'down',
	});

	// load images
	images.mapCollision_main = loadImage('assets/map/map-main_detection.png');
	images.mapCollision_onboarding = loadImage(
		'assets/map/map-onboarding_detection.png'
	);
	images.mapDisplay_main = loadImage('assets/map/map-main.png');
	images.mapDisplay_onboarding = loadImage('assets/map/map-onboarding.png');

	//startScene
	images.startBG = loadImage('assets/scene/startBG.png');
	images.lamp = loadImage('assets/scene/lamp.gif');
	images.light = loadImage('assets/scene/light.gif');

	//introScene
	images.IntroBG = loadImage('assets/scene/introBG.png');
	images.enterdoor = loadImage('assets/scene/enterdoor.gif');

	//lose
	images.loseBG = loadImage('assets/scene/lose.gif');

	//win
	images.winBG = loadImage('assets/scene/win.gif');
	images.clock = loadImage('assets/obj/clock.png');
	images.lampOil = loadImage('assets/obj/lampOil.png');
	CLOCK.img = images.clock;
	LAMP_OIL.img = images.lampOil;

	// reference: https://stackoverflow.com/questions/2383484/how-to-create-a-dynamic-object-in-a-loop
	for (let i = 0; i < PLAYER_NUM_LIMIT; i++) {
		AVATAR[i] = {};
		AVATAR[i].left = loadImage('assets/characters/character' + i + '/left.png');
		AVATAR[i].right = loadImage(
			'assets/characters/character' + i + '/right.png'
		);
		AVATAR[i].up = loadImage('assets/characters/character' + i + '/back.png');
		AVATAR[i].down = AVATAR[i].right;
	}
	// console.log(AVATAR);
	// load fonts
	fonts.rainyHeart = loadFont('assets/font/rainyhearts.ttf');
	fonts.zero4 = loadFont('assets/font/04B.TTF');

	// load sound
	sounds.bgm = loadSound('assets/sound/bgm/lamplighter_BGM.mp3');
	sounds.clickButton = loadSound('assets/sound/sfx/button.mp3');
	sounds.light_on = loadSound('assets/sound/sfx/light_on.mp3');
	sounds.lose = loadSound('assets/sound/sfx/lose.mp3');
	sounds.win = loadSound('assets/sound/sfx/win.mp3');
	sounds.pickup = loadSound('assets/sound/sfx/pickup.mp3');
	sounds.hitWall = loadSound('assets/sound/sfx/wall.mp3');
}

window.addEventListener('resize', () => {
	//update size
	size.width = window.innerWidth;
	size.height = window.innerHeight;
});

function newCanvasSize() {
	let x = (size.width - canvasZoomSize.width) / 2;
	let y = (size.height - canvasZoomSize.height) / 2 - 50;
	return { x: x, y: y };
}

function relocateCanvas() {
	let newCanvas = newCanvasSize();
	//relocate canvas
	canvas.position(newCanvas.x, newCanvas.y);
	//console.log(size, canvasSize, newCanvasSize());

	//relocate buttons
	// readyButton.position(110 + newCanvas.x, 324 + newCanvas.y);
	// startGameButton.position(116 + newCanvas.x, 324 + newCanvas.y);
	// restartButton_win.position(110 + newCanvas.x, 324 + newCanvas.y);
	// restartButton_lose.position(110 + newCanvas.x, 324 + newCanvas.y);
}

function setup() {
	pixelDensity(1);
	canvas = createCanvas(canvasSize.width, canvasSize.height);
	canvas.parent('canvas-wrap');
	//textAlign(CENTER, CENTER);
	textFont(fonts.rainyHeart);
	//frameRate(1);

	// calculate the total number of rows and columns in the canvas
	rowCount = canvasSize.height / GRID_SIZE;
	colCount = canvasSize.width / GRID_SIZE;

	moveCamera(me.row * GRID_SIZE, me.col * GRID_SIZE);

	// set shared variables
	if (partyIsHost()) {
		// when the player is the first player of the game
		partySetShared(shared, {
			gameState_Name: 'title',
			// there're five states in total
			// "title" state is the game title page
			// "onboarding" state is onboarding
			// "intro" state introduce game rules to players before the game starts
			// "main" state is the game play state
			// "winning" and "losing" state is the state the player goes into when they win or lose
			countdown: COUNT_DOWN,
			countdown_onBoarding: COUNT_DOWN_ONBOARDING,
			score: SCORE,
			players: PLAYERS, // all players in the game
			clock: [CLOCK._row, CLOCK._col], // cannot pass an image object in 'shared'
			lampOil: [LAMP_OIL._row, LAMP_OIL._col],
			playerAtGate: PLAYER_AT_GATE,
		});
	}

	//togglePanel();
	createButtons();
	assignPosition();
	//sounds.bgm.play();
}

function draw() {
	background(0);
	relocateCanvas();
	assignPlayers();

	switch (shared.gameState_Name) {
		case 'title':
			titleState();
			break;
		case 'onboarding':
			onboardingState();
			break;
		case 'intro':
			introState();
			// document.getElementById('role').innerHTML = "You're the " + me.role;
			break;
		case 'main':
			mainState();
			break;
		case 'winning':
			winningState();
			break;
		case 'losing':
			losingState();
			break;
	}

	noSmooth();
	// noLoop();
}

/* ------------------------- Collision Detection ------------------------- */

function isWall(gameState_Name, row, col) {
	let posX = col * GRID_SIZE;
	let posY = row * GRID_SIZE;
	let color;
	if (gameState_Name === 'main') {
		color = images.mapCollision_main.get(posX + 4, posY + 4);
	} else if (gameState_Name === 'onboarding') {
		color = images.mapCollision_onboarding.get(posX + 4, posY + 4);
	}
	// console.log(gameState_Name, row, col, posX, posY, color, color[3]);
	return color[3] === 255; // checking alpha channel
}

function isGate(gameState_Name, row, col) {
	if (gameState_Name === 'main') {
		if (
			row >= GATE.row &&
			row <= GATE.row + GATE.height &&
			col >= GATE.col &&
			col <= GATE.col + GATE.width
		) {
			// console.log('you reached the main gate');
			return true;
		} else {
			return false;
		}
	} else if (gameState_Name === 'onboarding') {
		if (
			row >= GATE_ONBOARDING.row &&
			row <= GATE_ONBOARDING.row + GATE_ONBOARDING.height &&
			col >= GATE_ONBOARDING.col &&
			col <= GATE_ONBOARDING.col + GATE_ONBOARDING.width
		) {
			// console.log('yeh you reached the onboarding gate');
			return true;
		} else {
			return false;
		}
	}
}

function isClock(row, col) {
	shared['clock'][0] = CLOCK._row;
	shared['clock'][1] = CLOCK._col;
	// console.log(shared["clock"][0],shared["clock"][1],row,col)
	if (row === shared['clock'][0] && col === shared['clock'][1]) {
		return true;
	} else {
		return false;
	}
}

function isLampOil(row, col) {
	shared['lampOil'][0] = LAMP_OIL._row;
	shared['lampOil'][1] = LAMP_OIL._col;
	// console.log(shared["lampOil"][0],shared["lampOil"][1],row,col)
	if (row === shared['lampOil'][0] && col === shared['lampOil'][1]) {
		return true;
	} else {
		return false;
	}
}

/* ------------------------- UTIL ------------------------- */

function changeState(win_or_lose_str) {
	console.log(shared.gameState_Name);
	sounds.clickButton.play();
	if (shared.gameState_Name === 'title') {
		shared.gameState_Name = 'onboarding';
	} else if (shared.gameState_Name === 'onboarding') {
		shared.gameState_Name = 'intro';
	} else if (shared.gameState_Name === 'intro') {
		shared.gameState_Name = 'main';
	} else if (
		shared.gameState_Name === 'main' &&
		win_or_lose_str === 'winning'
	) {
		shared.gameState_Name = 'winning';
	} else if (shared.gameState_Name === 'main' && win_or_lose_str === 'losing') {
		shared.gameState_Name = 'losing';
	} else if (
		shared.gameState_Name === 'winning' ||
		shared.gameState_Name === 'losing'
	) {
		shared.gameState_Name = 'title';
		restart();
	}
}

function restart() {
	shared.countdown = COUNT_DOWN;
	shared.countdown_onBoarding = COUNT_DOWN_ONBOARDING;
	shared.score = SCORE;
	shared.playerAtGate = PLAYER_AT_GATE;
	assignPosition();
}

function generateRandomPosition() {
	// generate clock at a random position
	let row, col;
	do {
		row = floor(random(0 + 5, rowCount - 5));
		col = floor(random(0 + 5, colCount - 5));
	} while (isWall(shared.gameState_Name, row, col)); // this needs to be false to end do-while
	// return row, col when it hits the wall (isWall == true)
	return {
		row: row,
		col: col,
		xPos: col * GRID_SIZE,
		yPos: row * GRID_SIZE,
	};
}

function calcPlayerAtGate() {
	let playerAtGate = 0;
	for (let i = 0; i < PLAYER_NUM_LIMIT; i++) {
		if (i < guests.length) {
			if (isGate(shared.gameState_Name, guests[i].row, guests[i].col)) {
				playerAtGate++;
			}
		}
	}
	shared.playerAtGate = playerAtGate;
}
