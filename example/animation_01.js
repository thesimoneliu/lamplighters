/* exported setup draw mousePressed */

let targetX = 0;
let x = 0;
const dX = 0;

function setup() {
  createCanvas(512, 512);
}

function draw() {
  background("black");
  fill("red");

  //
  // drive there
  //   if (x < targetX) {
  //     x += 10;
  //   } else if (x > targetX + 10) {
  //     x -= 10;
  //   } else {
  //     x = targetX;
  //   }

  // lerp
  x = lerp(x, targetX, 0.5);

  //
  // momentum
  // thrust in the right direction
  //   if (x < targetX) {
  //     dX += 5;
  //   } else {
  //     dX -= 5;
  //   }
  //   // apply speed to position
  //   x += dX;

  //   // apply friction to speed
  //   dX *= 0.8;

  ellipse(x, 256, 50, 50);
}

function mousePressed() {
  targetX = mouseX;
}