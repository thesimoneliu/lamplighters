let images = {};
let fonts = {};
let sounds = {};
let me, shared, guests;
let canvas;

const GRID_SIZE = 8; // the size of a single grid: 8px * 8px
let rowCount, colCount; // the number rows and columns in the canvas

const canvasSize = {
	width: 400,
	height: 400,
};
const size = {
	width: window.innerWidth,
	height: window.innerHeight,
};
const canvasZoomSize = {
	width: 800,
	height: 800,
};

const SCALEX = 4;
const SCALEY = 4;
// const VIEW_WIDTH = 400/GRID_SIZE/SCALEX;
// const VIEW_HEIGHT = 400/GRID_SIZE/SCALEY;
const mainCamera = { x: 0, y: 0 };

// variables passed to shared
const COUNT_DOWN = 80;
const COUNT_DOWN_ONBOARDING = 10;
const SCORE = 5;
const PLAYER_NUM_LIMIT = 4;
const PLAYER_AT_GATE = 0;

let lightRadius = 10;
let biggerLight = false;
let nearbySum = 0;
let gapTimeLastPickup_clock = 0;
let gapTimeLastPickup_lampOil = 0;

// The localPlayerData is a map of guests to local data
// on each particpant. This is used to keep track of a transition position
// when a player moves to a new square.
const localPlayerData = new Map();

const AVATAR = [];

const GATE = {
	row: 22 + 4 - 2, //24
	col: 20 + 5 - 2, //23
	width: 6, //29
	height: 4, //28
};

const GATE_ONBOARDING = {
	row: 20 + 4 - 2, //24
	col: 16 + 5 - 2, //23
	width: 11, //29
	height: 5, //28
};


const PLAYERS = [
	{
		row: 4, //TOP LEFT
		col: 5,
	},
	{
		row: 4, //TOP RIGHT
		col: 45,
	},
	{
		row: 45, //BOTTOM LEFT
		col: 5,
	},
	{
		row: 45, //BOTTOM RIGHT
		col: 45,
	},
];

const CLOCK = {
	count: 3,
	workingDuration: 20,
	gapDuration: 15,
	_row: 0,
	_col: 0,
	_xPos: function () {
		return this._col * GRID_SIZE;
	},
	_yPos: function () {
		return this._row * GRID_SIZE;
	},
	status: 'hide',
};

const LAMP_OIL = {
	count: 3,
	workingDuration: 20,
	gapDuration: 20,
	_row: 0,
	_col: 0,
	_xPos: function () {
		return this._col * GRID_SIZE;
	},
	_yPos: function () {
		return this._row * GRID_SIZE;
	},
	status: 'hide',
};

const COLORS = {
	bgColor_onboarding:'#342B29',
	button_active: '#CF6831',
	button_border: '#8f5535',
	button_inactive: '#F8C6AB',
	intro_text: '#FFB036',
	intro_caption: '#CACACA'
};
