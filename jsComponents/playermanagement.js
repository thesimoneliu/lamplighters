/* ------------------------- Player Management ------------------------- */


function drawAllPlayers() {
	for (let i = 0; i < PLAYER_NUM_LIMIT; i++) {
		if (i < guests.length) {
			guests[i].xPos = guests[i].col * GRID_SIZE;
			guests[i].yPos = guests[i].row * GRID_SIZE;
			image(AVATAR[guests[i].avatar].down, guests[i].xPos, guests[i].yPos);

			// check the distance between players
			// if players are close enough
			// they will see each other's light
			// and their lights are bigger
			let distPlayers = dist(me.xPos, me.yPos, guests[i].xPos, guests[i].yPos);
			if (me != guests[i] && distPlayers <= lightRadius * 5) {
				// biggerLight = true;
				if (me.nearbyPlayer[i] == 0) {
					me.nearbyPlayer[i] = 1;
				}
				// console.log(me.nearbyPlayer);
			} else if (
				(me != guests[i] && distPlayers > lightRadius * 5) ||
				!guests[i]
			) {
				// biggerLight = false;
				me.nearbyPlayer[i] = 0;
				// console.log(me.nearbyPlayer);
				lightRadius = 10;
			}
			nearbySum += me.nearbyPlayer[i];
			// console.log(nearbySum);
			lightRadius = 10 + 3 * nearbySum;
		}
	}
	nearbySum = 0;
}

function assignPosition() {
	for (let i = 0; i < PLAYER_NUM_LIMIT; i++) {
		if (i < guests.length) {
			guests[i].row = shared.players[i].row;
			guests[i].col = shared.players[i].col;
		}
	}
}

function assignPlayers() {
	for (let i = 0; i < PLAYER_NUM_LIMIT; i++) {
		if (!guests.find((p) => p.role === 'player' + i)) {
			// console.log("need player" + i);
			// find the first observer
			const o = guests.find((p) => p.role === 'observer');
			// console.log("found", o, me, o === me);
			// if thats me, take the role
			if (o === me) {
				o.role = 'player' + i;
				o.avatar = i;
			}
		}
	}

	
}