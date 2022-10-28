let images = {};
let fonts ={};
let sounds = {};
let me, shared, guests;

const GAME_STATE = {title:"title"};

const GRID_SIZE = 8; // the size of a single grid: 8px * 8px
let rowNum, colNum; // the number rows and columns in the canvas

// vars passed to shared
const COUNT_DOWN = 100;
const SCORE = 0;
const PLAYER_NUM_LIMIT = 4;

let LIGHT_RADIUS = 10;
let biggerLight = false;
// let nearbyPlayer = [];
let nearbySum = 0;

const SCALEX = 4;
const SCALEY = 4;
// const VIEW_WIDTH = 400/GRID_SIZE/SCALEX;
// const VIEW_HEIGHT = 400/GRID_SIZE/SCALEY;
const mainCamera = { x: 0, y: 0 };

// The localPlayerData is a map of guests to local data
// on each particpant. This is used to keep track of a transition position
// when a player moves to a new square.
const localPlayerData = new Map();

const AVATAR = [];

const GATE = {
	row: 22 + 4 - 2, //24
	col: 20 + 5 - 2, //23
	width: 6,  //29
	height: 4, //28
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
