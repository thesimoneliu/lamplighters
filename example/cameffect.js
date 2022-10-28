

/* exported setup draw mousePressed*/

const sprites = [];

let cameraShakeAmount = 0;

function setup() {
  createCanvas(512, 512);
  noFill();
  noStroke();

  for (let i = 0; i < 100; i++) {
    sprites.push({
      x: random(width),
      y: random(height),
      dX: random(1, 2),
      dY: 0,
      size: random(10, 50),
    });
  }
}

function draw() {
  // update
  for (const sprite of sprites) {
    sprite.x += sprite.dX;
    sprite.y += sprite.dY;
    sprite.x = mod(sprite.x, width);
    sprite.y = mod(sprite.y, height);
  }

  // draw
  push();
  cameraShake();
  background("black");
  stroke("white");
  for (const sprite of sprites) {
    ellipse(sprite.x, sprite.y, sprite.size);
  }
  ellipse(width * 0.5, height * 0.5, 512);

  pop();

  // ui
  push();
  fill("white");
  noStroke();
  text("click to shake", 10, 20);
  pop();
}

function cameraShake() {
  translate(width * 0.5, height * 0.5);

  translate(
    range_noise(-1, 1, frameCount * 0.8, 1) * cameraShakeAmount,
    range_noise(-1, 1, frameCount * 0.8, 2) * cameraShakeAmount
  );
  rotate(
    radians(range_noise(-0.2, 0.2, frameCount * 0.8, 3) * cameraShakeAmount)
  );
  translate(-width * 0.5, -height * 0.5);

  cameraShakeAmount *= 0.9;
}
function mousePressed() {
  cameraShakeAmount += 10;
}

function range_noise(min, max, a = 0, b = 0, c = 0) {
  push();
  noiseDetail(2, 0.5); // this config has a .75 max
  pop();
  return map(noise(a, b, c), 0, 0.75, min, max);
}
function mod(n, m) {
  return ((n % m) + m) % m;
}
