/* ------------------- CAMERA ------------------- */

function cameraMovement() {
    // move camera
    moveCamera(me.xPos, me.yPos, Infinity);
  }
  
  // x is camera position
  // y is local user position
  function moveCamera(x, y, max) {
    movePoint(mainCamera, { x, y }, max);
  }
  
  function movePoint(p1, p2, max = Infinity) {
    // bridge the gap between camera and local user position
    const dX = constrain(p2.x - p1.x, -max, max);
    const dY = constrain(p2.y - p1.y, -max, max);
    p1.x += dX;
    p1.y += dY;
  }
  