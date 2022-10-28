/* ------------------------- Lamplight ------------------------- */

function lightenLamp() {
    noStroke();
    ellipse(me.xPos + 4, me.yPos + 4, LIGHT_RADIUS * 5 + sin(second()*3), LIGHT_RADIUS * 5 + sin(second()*3));
    // if (biggerLight) {
          for (let j = 0; j <= me.nearbyPlayer.length; j++) {
            if (me.nearbyPlayer[j] == 1 && guests[j]) {
              ellipse(
              guests[j].xPos + 4,
              guests[j].yPos + 4,
              LIGHT_RADIUS * 5 + sin(second()*3),
              LIGHT_RADIUS * 5 + sin(second()*3)
            );
            }
  
      }
    // }
    filter(BLUR, 5);
    filter(POSTERIZE, 2);
    filter(BLUR, 5);
  }