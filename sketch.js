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
		'Lamplighters_ver3.3_final-sprint_1028',
		'main'
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
	images.mapCollision = loadImage('assets/map/map_detection.png');
	images.mapDisplay = loadImage('assets/map/map_400.png');
	images.startBG = loadImage('assets/scene/start.png');
	images.IntroBG = loadImage('assets/scene/intro.png');
	images.loseBG = loadImage('assets/scene/lose.gif');
	images.loseGIF = loadImage('assets/scene/loseGIF.gif');
	images.winBG = loadImage('assets/scene/win.gif');
	images.winGateGIF = loadImage('assets/scene/win_gate.gif');
	images.clock = loadImage('assets/obj/clock.png');
	images.lampOil = loadImage('assets/obj/lampOil.png');
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
	// load sound
	sounds.bgm = loadSound('assets/sound/lamplighter_BGM.mp3');
}

function setup() {
	pixelDensity(1);
	createCanvas(400, 400);
	textAlign(CENTER, CENTER);
	//textFont(fonts.rainyHeart);

	// calculate the total number of rows and columns in the canvas
	rowNum = height / GRID_SIZE;
	colNum = width / GRID_SIZE;

	moveCamera(me.row * GRID_SIZE, me.col * GRID_SIZE);

	// set shared variables
	if (partyIsHost()) {
		// when the player is the first player of the game
		partySetShared(shared, {
			gameState_Name: 'title',
			// there're five states in total
			// "title" state is the game title page
			// "intro" state introduce game rules to players before the game starts
			// "main" state is the game play state
			// "winning" and "losing" state is the state the player goes into when they win or lose
			countdown: COUNT_DOWN,
			score: SCORE,
			players: PLAYERS, // all players in the game
			clock: { xPos: 0, yPos: 0, img: images.clock },
			lampOil: { xPos: 0, yPos: 0, img: images.lampOil },
		});
	}

	togglePanel();
	createButtons();
	assignPosition();
}

function draw() {
	background(0);
	assignPlayers();
	noSmooth();

	switch (shared.gameState_Name) {
		case 'title':
			titleState();
			break;
		case 'intro':
			introState();
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

	// noLoop();
}

/* ------------------------- Collision Detection ------------------------- */

function isWall(row, col) {
	let posX = col * GRID_SIZE;
	let posY = row * GRID_SIZE;
	const color = images.mapCollision.get(posX + 4, posY + 4);
	// console.log(row, col, posX, posY, color[3]);
	return color[3] === 255; // checking alpha channel
}

function isGate(row, col) {
	if (
		row >= GATE.row &&
		row <= GATE.row + GATE.height &&
		col >= GATE.col &&
		col <= GATE.col + GATE.width
	) {
		console.log('yeh you reached the gate');
		return true;
	} else {
		return false;
	}
}

function isClock(row,col){
	if(
		row == shared.clock.yPos / GRID_SIZE,
		col == shared.clock.xPos / GRID_SIZE
	){
		return true;
	}else{
		return false;
	}
}


function isLampOil(row,col){
	if(
		row == shared.lampOil.yPos / GRID_SIZE,
		col == shared.lampOil.xPos / GRID_SIZE
	){
		return true;
	}else{
		return false;
	}
}

/* ------------------------- UTIL ------------------------- */

function changeState(win_or_lose_string) {
	console.log(shared.gameState_Name);
	if (shared.gameState_Name === 'title') {
		shared.gameState_Name = 'intro';
	} else if (shared.gameState_Name === 'intro') {
		shared.gameState_Name = 'main';
	} else if (
		shared.gameState_Name === 'main' &&
		win_or_lose_string === 'winning'
	) {
		shared.gameState_Name = 'winning';
	} else if (
		shared.gameState_Name === 'main' &&
		win_or_lose_string === 'losing'
	) {
		shared.gameState_Name = 'losing';
	} else {
		shared.gameState_Name = 'title';
	}
}

function restart() {
	changeState();
	shared.countdown = COUNT_DOWN;
	shared.score = SCORE;
	assignPosition();
}

function generateRandomNum() {
	let row = int(random(0 + 5, rowNum - 5));
	let col = int(random(0 + 5, colNum - 5));
	if (!isWall(row, col)) {
		let position = {
			xPos: col * GRID_SIZE,
			yPos: row * GRID_SIZE
		}
		console.log(position);
		return position;
	} else {
		generateRandomNum();
	}
}
