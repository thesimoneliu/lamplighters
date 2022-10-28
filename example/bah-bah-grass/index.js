let shared;
let me;
let guests;

let shared_time;
let shared_state;
let shared_farmer;

let nom

let gridSize = 20;

let i = 0;


function preload() {
    partyConnect(
        "wss://deepstream-server-1.herokuapp.com",
        "rrivera_bah-bah-grass_beta",
        "main"
    );
    shared = partyLoadShared("shared", {
        grid: [],
        eaten: 0,
    });

    me = partyLoadMyShared({role: "observer"});
    guests = partyLoadGuestShareds();

    shared_time = partyLoadShared("shared_time");

    shared_state = partyLoadShared("shared_state", {
        gameMode: 0,
        won: false,
        outOfTime: false
    });

    shared_farmer = partyLoadShared("shared_farmer", {
        farmerTimer : 10,
        madeIt: false
    });

    //player 1- sheep
    sheep = loadImage("./assets/sheep.png");
    sheep2 = loadImage("./assets/sheep-2.png");
    sheep_left = loadImage("./assets/sheep_left.png");
    sheep_right = loadImage("./assets/sheep_right.png");
    sheep_behind = loadImage("./assets/sheep_behind.png");

    //player 2- ram
    ram = loadImage("./assets/ram.png");
    ram_left = loadImage("./assets/ram_left.png");
    ram_right = loadImage("./assets/ram_right.png");
    ram_behind = loadImage("./assets/ram_behind.png");

    //grass
    grass = loadImage("./assets/grass.png");
    grass_alternative = loadImage("./assets/grass_alternative.png");
    grass_alternative2 = loadImage("./assets/grass_alternative2.png");
    grass_alternative3 = loadImage("./assets/grass_alternative3.png");

    //grass for backgrounds
    grass_start = loadImage("./assets/grass_starter.png");
    grass_instruct = loadImage("./assets/grass_instruction.png")
    gif = loadImage('./assets/background.gif');
    
    //buttons
    start_pressed = loadImage("./assets/start-pressed.png");
    start_unpressed = loadImage("./assets/start-btn_unpressed.png");
    play_pressed = loadImage("./assets/play-pressed.png");
    play_unpressed = loadImage("./assets/play-btn_unpressed.png");


    //logo
    logo = loadImage("./assets/logo.png");

    // other assets
    fence = loadImage("./assets/fence.png");
    farmer = loadImage("./assets/farmer.png");
    plank = loadImage("./assets/plank.png");

    //sounds
    click = loadSound("./assets/button.wav") //for button clicks
    nom = loadSound("./assets/nom_noise.wav"); //for sheep eating
    end_game = loadSound("./assets/end-game.wav"); //end game sound
    banjo = loadSound("./assets/banjo.wav"); //start game sound
    sheep_noise = loadSound("./assets/sheep.wav"); //gameOn sheep noises

    yPosMoving = 300 // initializing hovering text Animation
    
}


function setup() {
    //sound setups
    nom.setVolume(0.1);
    click.setVolume(10);
    banjo.setVolume(0.5);
    sheep_noise.setVolume(0.5);

    partyToggleInfo(true);
    textFont('Pixeloid Sans');

    if (partyIsHost()) {
        resetGrid();
        partySetShared(shared_time, {gameTimer: 90});
        partySetShared(shared_farmer,  {posX: floor(random(0,19)), posY: floor(random(0,19))});

    }
    me.sheep = { posX: 0, posY: -20 };
    seed = createImg("./assets/seed_planted.png", "grass seed art");
}

function draw() {
    switch (shared_state.gameMode) {
        case 0:
            startingScreen();
            break;
        case 1:
            instructScreen();
            break;
        case 2:
            gameOn();
            break;
        case 3:
            gameOver();
            break;
    }
}

function startingScreen() {
    createCanvas(600, 600);
    background("#99ccff");
    fill('#703e14');
    seed.hide();

    push();
    textSize(35);
    image(gif, 0, 0);
    gif.play();
    image(grass_start, 0, 0);
    image(logo, 10, -60);
    image(farmer, 10, 170, 275, 400);

    textSize(20);
    textAlign(CENTER, CENTER);
    const yPosMoving = max(sin((-frameCount * 40) / 600) * 5); //hovering text animation
    text("Click 'start' to continue", 440, yPosMoving+310);
    pop();

    //start button
    push();
    if (mouseIsPressed) {
      image(start_pressed, 310, 350);   
    }
    else {
      image(start_unpressed, 310, 350)
    }
    pop();
    
}

//for buttons to changeState()
function mouseReleased(){
    if (shared_state.gameMode == 0) {
        click.play(); 
        changeState();
    }
    else if(shared_state.gameMode == 1) {
        click.play(); 
        changeState();
    }
    else if(shared_state.gameMode === 3) {
        click.play(); 
        changeState();
    }

}

function instructScreen() {
    createCanvas(600, 600);
    background("#99ccff");
    fill('#703e14');
    seed.hide();

    image(gif, 0, 0);
    gif.play();
    image(grass_instruct, 0, 0);
    image(logo, 210, 5, 160, 80);

    push();
    textSize(35);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    text("Instructions", 300, 126);
    pop();
    textSize(20);
    textAlign(CENTER, CENTER);
    textStyle(NORMAL);
    text("Eat all grass squares with your teammate", 300, 175);
    text("before the time runs out.", 300, 215);
    text("Watch out for the farmer replanting grass!", 300, 260);
    text("Get to the seed before it grows back", 300, 305);

     //start button
    push();
    if (mouseIsPressed) {
      image(start_pressed, 170, 350);  }
    else {
      image(start_unpressed, 170, 350);
    }
    pop();

}

function gameOn() {
    createCanvas(600, 600);
    background("#faf7e1");
    image(fence, -10, 0, 620, 600);
    image(logo, 210, 5, 160, 80);

    translate(90,100);
    assignPlayers();
    drawGrid();
    seed.position((shared_farmer.posX*gridSize)+95,(shared_farmer.posY*gridSize)+100);
    seed.size(25, 25);
    seed.hide();
    drawSheep();
    gameTimer();
    drawUI();

    replantingGrass();

    // gameOver trigger
    if (shared.eaten == gridSize * gridSize) {
        shared_state.won = true;
        shared_state.gameMode = 3;
        console.log("Game over: all grass eaten, you win");
    }
}

function gameOver() {
    seed.hide();
    createCanvas(600, 600);
    textFont('Pixeloid Sans');
    textSize(35);
    textAlign(CENTER, CENTER);
    background("#99ccff");
    fill('#703e14');

    image(gif, 0, 0);
    gif.play();
    image(grass_start, 0, 0, 600, 600);
    image(logo, 210, 5, 160, 80);
    image(farmer, 10, 170, 275, 400);
    image(sheep2, 280, 360);

    push();
    textStyle(BOLD);
    text("Your Score:", 431, 120);
    textSize(100);
    const yPosMoving = max(sin((-frameCount * 40) / 600) * 5); //hovering text animation
    text(shared.eaten, 431, yPosMoving+200);
    pop();

    //restart button
    push();
    if (mouseIsPressed) {
      image(play_pressed, 300, 260);  }
    else {
      image(play_unpressed, 300, 260);
    }
    pop();

}

function assignPlayers() {
    // if there isn't a sheep
    if (!guests.find((p) => p.role === "sheep")) {
        // console.log("need sheep");
        // find the first observer
        const o = guests.find((p) => p.role === "observer");
        // console.log("found first observer", o, me, o === me);
        // if thats me, take the role
        if (o === me) o.role = "sheep";
    }
    if (!guests.find((p) => p.role === "ram")) {
        const o = guests.find((p) => p.role === "observer");
        if (o === me) o.role = "ram";
    }
}

function drawGrid() {
    push();
    translate(0,0);
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const x = col * gridSize;
            const y = row * gridSize;
            stroke('#94541E');

            //alternative grass
            if (shared.grid[2][3] === false) {
                image(grass_alternative2, 2*gridSize, 3*gridSize, gridSize, gridSize);
            }
            if (shared.grid[4][5] === false) {
                image(grass_alternative3, 4*gridSize, 5*gridSize, gridSize, gridSize);
            }
            if (shared.grid[4][6] === false) {
                image(grass_alternative, 4*gridSize, 6*gridSize, gridSize, gridSize);
            }
            if (shared.grid[8][8] === false) {
                image(grass_alternative3, 8*gridSize, 8*gridSize, gridSize, gridSize);
            }
            if (shared.grid[1][2] === false) {
                image(grass_alternative, 1*gridSize, 2*gridSize, gridSize, gridSize);
            }
            if (shared.grid[18][18] === false) {
                image(grass_alternative2, 18*gridSize, 18*gridSize, gridSize, gridSize);
            }
            if (shared.grid[19][14] === false) {
                image(grass_alternative3, 19*gridSize, 14*gridSize, gridSize, gridSize);
            }
            if (shared.grid[13][15] === false) {
                image(grass_alternative2, 13*gridSize, 15*gridSize, gridSize, gridSize);
            }
            if (shared.grid[3][18] === false) {
                image(grass_alternative2, 3*gridSize, 18*gridSize, gridSize, gridSize);
            }
            if (shared.grid[2][15] === false) {
                image(grass_alternative, 2*gridSize, 15*gridSize, gridSize, gridSize);
            }
            if (shared.grid[19][3] === false) {
                image(grass_alternative, 19*gridSize, 3*gridSize, gridSize, gridSize);
            }
            if (shared.grid[15][4] === false) {
                image(grass_alternative3, 15*gridSize, 4*gridSize, gridSize, gridSize);
            }
            



            if (shared.grid[col][row] === false) {
                fill('#154f1b'); //green
                rect(x, y , gridSize, gridSize);
        
                    image(
                        grass,
                        x,
                        y,
                        gridSize,
                        gridSize
                    )
            } else {
                fill('#94541E');
                rect(x , y , gridSize, gridSize);
            }
            
        }
    }
    
}

function drawSheep() {
    push();
    translate(-8, -10);
    //draw sheep for player 1
    const p1 = guests.find((p) => p.role === "sheep");
    if (p1) {
        push();
        translate(p1.sheep.posX, p1.sheep.posY);
        rotateSheep_p1(p1);
        imageMode(CENTER);
        pop();
    }
    //draw sheep for player 2
    const p2 = guests.find((p) => p.role === "ram");
    if (p2) {
        push();
        translate(p2.sheep.posX, p2.sheep.posY);
        rotateSheep_p2(p2);
        imageMode(CENTER);
        pop();
    }
    pop();
}

function rotateSheep_p1(test) {
    if (test.direction === "down") {
        image(
            sheep,
            0,
            0,
            gridSize + 15,
            gridSize + 15
          );
    }
    if (test.direction === "left"){
        image(
            sheep_left,
            0,
            0,
            gridSize + 15,
            gridSize + 15
          );
    };
    if (test.direction === "right"){
        image(
            sheep_right,
            0,
            0,
            gridSize + 15,
            gridSize + 15
          );
    };
    if (test.direction === "up"){
        image(
            sheep_behind,
            0,
            0,
            gridSize + 15,
            gridSize + 15
          );
    };
  }

function rotateSheep_p2(test) {
    if (test.direction === "down") {
        image(
            ram,
            0,
            0,
            gridSize + 15,
            gridSize + 15
          );
    }
    if (test.direction === "left"){
        image(
            ram_left,
            0,
            0,
            gridSize + 15,
            gridSize + 15
          );
    };
    if (test.direction === "right"){
        image(
            ram_right,
            0,
            0,
            gridSize + 15,
            gridSize + 15
          );
    };
    if (test.direction === "up"){
        image(
            ram_behind,
            0,
            0,
            gridSize + 15,
            gridSize + 15
          );
    };
  }

function gameTimer() {
    if (partyIsHost()) {
        if (frameCount % 60 === 0) {
            shared_time.gameTimer--;
        }
    
        if (shared_time.gameTimer === 0) {
            console.log("Game Over: timer ran out")
            shared_state.outOfTime = true;
            shared_state.gameMode = 3;
            end_game.play();
        }
    }
   
}

function replantingGrass() {
    const x = shared_farmer.posX * gridSize; //drawing offset
    const y = shared_farmer.posY * gridSize; //drawing offset
  
    const p1 = guests.find((p) => p.role === "sheep");
    const p2 = guests.find((p) => p.role === "ram");

    if ((shared_time.gameTimer <= 85 && shared_time.gameTimer > 75) ||
        (shared_time.gameTimer <= 65 && shared_time.gameTimer > 55)) {
        image(farmer, 428, 0, 50, 50);
        seed.show();
        if(partyIsHost()) {
            if (frameCount % 60 === 0) {
                shared_farmer.farmerTimer--;
            }
        }
        if ((p1 === me) || (p2 === me)) { // if either player made it to the seed
            if ((me.sheep.posX === x && me.sheep.posY === y)) {
                shared_farmer.madeIt = true;
            }
        }
        if (shared_farmer.farmerTimer === 0) { //this works!
            if (shared_farmer.madeIt === false) {
                console.log("Didn't get seed in time")
                for (i = 0; i < gridSize; i++) {
                    shared.grid[i][shared_farmer.posY] = false;
                }
            }
        } 
        if (shared_farmer.madeIt === true) {
            console.log("You got to seed in time!")
            seed.hide();
            shared.grid[shared_farmer.posX][shared_farmer.posY] = true;
        }
        text(shared_farmer.farmerTimer, 453,70);
    } 
    else {
        shared_farmer.farmerTimer = 10;
        shared_farmer.madeIt = false;
    } 
}

function drawUI() {
    push();
    translate(0,40);
    textAlign(CENTER, CENTER);
    fill("#492905");
    textSize(20);
    textStyle(BOLD);
    text(me.role,285,420);
    textAlign(LEFT);
    text("Grass eaten: " + shared.eaten, 0, 420);
    textAlign(CENTER, CENTER);
    text(shared_time.gameTimer, 390, 420);
    pop();
}

function keyPressed() {
    if (shared_state.gameMode == 2){
        const p1 = guests.find((p) => p.role === "sheep");
        const p2 = guests.find((p) => p.role === "ram");

        if ((p1 === me) || (p2 === me)) {
            //play nom sound
            let speed = random(0.8,1.1); //varies sheep nom sounds
            nom.rate(speed);
            nom.play();

            if ((keyCode === DOWN_ARROW) || (keyCode === 83)) {
                me.direction = "down";
                tryMove(0, gridSize);
            }
            if ((keyCode === UP_ARROW) || (keyCode === 87)) {
                me.direction = "up";
                tryMove(0, -gridSize);
            }
            if ((keyCode === LEFT_ARROW) || (keyCode === 65)) {
                me.direction = "left";
                tryMove(-gridSize, 0);
            }
            if ((keyCode === RIGHT_ARROW) || (keyCode === 68)) {
                me.direction = "right";
                tryMove(gridSize, 0);
            }
        
            let col = me.sheep.posX / gridSize;
            let row = me.sheep.posY / gridSize;
            
            if (shared.grid[col][row] === false) { //planted            
                shared.grid[col][row] = true;
                shared.eaten = shared.eaten + 1;
            } 
        }
    }
}

function tryMove(x, y) {
    const targetLocation = { x: me.sheep.posX + x, y: me.sheep.posY + y };
    const bounds = { x: 0, y: 0, w: gridSize*19, h: gridSize*19};
    if (!pointInRect(targetLocation, bounds)) {
      return;
    }
  
    me.sheep.posX += x;
    me.sheep.posY += y;
}

//restrict outside fence/grid movement
function pointInRect(p, r) {
    return (
      p.x >= r.x && // format wrapped
      p.x <= r.x + r.w &&
      p.y >= r.y &&
      p.y <= r.y + r.h
    );
  }

function changeState() {
    if (shared_state.gameMode == 0) {
        banjo.play(); 
        shared_state.gameMode = 1;
    } else if (shared_state.gameMode == 1) {
        banjo.stop();
        sheep_noise.play();
        shared_state.gameMode = 2;
    }
    else if (shared_state.gameMode == 3) {
        shared_state.gameMode = 0;
        setup();
        me.sheep = { posX: 0, posY: -20 };
    }
}

function resetGrid() {
    const newGrid = [];
    for (let col = 0; col < gridSize; col++) {
        newGrid[col] = new Array(gridSize).fill(false);
    }
    shared.grid = newGrid;
    shared.eaten = 0;
}


