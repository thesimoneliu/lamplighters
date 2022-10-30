/* ------------------------- Debug Tools ------------------------- */

function drawGrid() {
	//image(images.mapCollision, 0, 0);

	for (let row = 0; row < rowCount; row++) {
		for (let col = 0; col < colCount; col++) {
			// draw Grid
			noFill();
			stroke(20);
			strokeWeight(0.3);
			rect(col * GRID_SIZE, row * GRID_SIZE, GRID_SIZE);
			// write Grid Number
			fill(0);
			textSize(4);
			let txt = col === 0 ? row : col;
			text(txt, col * GRID_SIZE + 4, row * GRID_SIZE + 4);
			// draw flag
			if (isWall(row, col)) {
				fill('red');
				noStroke();
				rect(col * GRID_SIZE + 4, row * GRID_SIZE + 4, 2);
			}
		}
	}

  //winGate position
	stroke('red');
	strokeWeight(2);
	noFill();
	rect(
		GATE.col * GRID_SIZE,
		GATE.row * GRID_SIZE,
		GATE.width * GRID_SIZE,
		GATE.height * GRID_SIZE
	);
}

function togglePanel() {
	partyToggleInfo(true); // info panel is hidden by default
	const toggleButton = createButton('Toggle Info').mousePressed(() => {
		partyToggleInfo(); // pass nothing to toggle
	});
	toggleButton.parent(document.querySelector('main'));

	const showButton = createButton('Show Info').mousePressed(() => {
		partyToggleInfo(true); // pass true to show
	});
	showButton.parent(document.querySelector('main'));

	const hideButton = createButton('Hide Info').mousePressed(() => {
		partyToggleInfo(false); // pass false to hide
	});
	hideButton.parent(document.querySelector('main'));
}

/* ----------------------- Unused ------------------ */
function defineMask(maskCenterX, maskCenterY) {
	fill(200);
	lamplight.ellipse(maskCenterX, maskCenterY, 80);
	noSmooth();
}
