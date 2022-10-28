/* 
reference:
animation: 
- https://www.notion.so/Week-8-f48ad22cdbd443cbba65696b5c29b729
- 
*/



/* exported setup draw */

const sprites = [];
let targetSize = 20;

function setup() {
  createCanvas(500, 500);
  noFill();
  noStroke();

  for (let i = 0; i < 100; i++) {
    sprites.push({
      x: (i % 10) * 50 + 25,
      y: floor(i / 10) * 50 + 25,
      size: 10,
      dSize: 0,
      speed: random(0.1, 4),
    });
  }

  createButton("20").mousePressed(() => {
    targetSize = 20;
  });
  createButton("40").mousePressed(() => {
    targetSize = 40;
  });
  createButton("80").mousePressed(() => {
    targetSize = 80;
  });
}

function draw() {
  // step
  for (const sprite of sprites) {
    //
    // direct
    // sprite.size = targetSize;
    //
    // linear
    // sprite.size += sprite.size < targetSize ? 1 : -1;

    //
    // ease out
    // sprite.size += (targetSize - sprite.size) * 0.1;
    // or equivalently
    // sprite.size = lerp(sprite.size, targetSize, 0.4);
    //
    // momentum
    // if (sprite.size < targetSize - 1) {
    //   sprite.dSize += 0.3;
    // }
    // if (sprite.size > targetSize + 1) {
    //   sprite.dSize -= 0.3;
    // }
    // sprite.dSize *= 0.9;
    // sprite.size += sprite.dSize;
    //
    // linear w/ random variation
    // if (sprite.size < targetSize) {
    //   sprite.size += sprite.speed;
    // } else if (sprite.size > targetSize + sprite.speed) {
    //   sprite.size -= sprite.speed;
    // }
    //
    // ease out w/ random variation
    sprite.size += (targetSize - sprite.size) * (0.2 / sprite.speed);
    //
    // ease out w/ spacial variation
    // sprite.size +=
    //   (targetSize - sprite.size) * map(sprite.x, 0, 500, 0.05, 0.2);
  }

  // draw
  push();

  background("black");
  fill("white");
  for (const sprite of sprites) {
    ellipse(sprite.x, sprite.y, sprite.size);
  }
  pop();
}
function roundTo(value, x) {
  return Math.round(value / x) * x;
}