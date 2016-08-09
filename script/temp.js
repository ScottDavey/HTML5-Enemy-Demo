/**********************
*****  ULILITIES  *****
**********************/
var RectangleExtensions = {
	GetIntersectionDepth: function (rectA, rectB) {
		var halfWidthA, halfWidthB, halfHeightA, halfHeightB, centerA, centerB, distanceX, distanceY, minDistanceX, minDistanceY, depthX, depthY;
		// Calculate Half sizes
		halfWidthA		= rectA.width / 2.0;
		halfWidthB		= rectB.width / 2.0;
		halfHeightA		= rectA.height / 2.0;
		halfHeightB		= rectB.height / 2.0;

		// Calculate centers
		centerA			= new Vector2(rectA.left + halfWidthA, rectA.top + halfHeightA);
		centerB			= new Vector2(rectB.left + halfWidthB, rectB.top + halfHeightB);

		distanceX		= centerA.x - centerB.x;
		distanceY		= centerA.y - centerB.y;
		minDistanceX	= halfWidthA + halfWidthB;
		minDistanceY	= halfHeightA + halfHeightB;

		// If we are not intersecting, return (0, 0)
		if (Math.abs(distanceX) >= minDistanceX || Math.abs(distanceY) >= minDistanceY)
			return new Vector2(0, 0);

		// Calculate and return intersection depths
		depthX			= distanceX > 0 ? minDistanceX - distanceX : -minDistanceX - distanceX;
		depthY			= distanceY > 0 ? minDistanceY - distanceY : -minDistanceY - distanceY;

		return new Vector2(depthX, depthY);
	}
};

var Vector2 = function(x, y) {
    this.x = x;
    this.y = y;
};

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function SecondsToTime (s) {
	var h, m, s;
	s = Number(s);
	h = Math.floor(s / 3600);
	m = Math.floor(s % 3600 / 60);
	s = Math.floor(s % 3600 % 60);
	return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
}

var fps = {
	startTime : 0,
	frameNumber : 0,
	getFPS : function () {
		var d, currentTime, result;
		this.frameNumber++;
		d 			= new Date().getTime();
		currentTime = (d - this.startTime) / 1000;
		//result 		= Math.floor(this.frameNumber / currentTime);
		result			= (this.frameNumber / currentTime).toFixed(2);

		if (currentTime > 1) {
			this.startTime 		= new Date().getTime();
			this.frameNumber 	= 0;
		}

		return result;
	}
};

/*******************************************
**************  INPUT OBJECT  **************
*******************************************/
var Input = {
	Keys: {
		_isPressed: {},
		W: 87,
		A: 65,
		S: 83,
		D: 68,
		SPACE: 32,
		R: 82,
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,
		ONE: 49,
		GetKey: function (keyCode) {
			return Input.Keys._isPressed[keyCode];
		},
		onKeyDown: function (e) {
			Input.Keys._isPressed[e.keyCode] = true;
		},
		onKeyUp: function (e) {
			delete Input.Keys._isPressed[e.keyCode];
		}
	}
};

/****************************
*****  RECTANGLE CLASS  *****
****************************/
function Rectangle (x, y, width, height) {
	this.x		= x;
	this.y		= y;
	this.width	= width;
	this.height	= height;
	this.left	= this.x;
	this.top	= this.y;
	this.right	= this.x + this.width;
	this.bottom	= this.y + this.height;
	this.center	= new Vector2((this.x + (this.width/2)), (this.y + (this.height/2)));
}

/***********************
*****  LINE CLASS  *****
***********************/
function Line (startPos, endPos, color) {
	this.startPos	= startPos;
	this.endPos		= endPos;
	this.color		= color;
};

Line.prototype.draw = function () {
	game.context.save();
	game.context.lineWidth = 1;
	game.context.strokeStyle = (typeof this.color === 'undefined') ? '#00FF88' : this.color;
	game.context.beginPath();
	game.context.moveTo(this.startPos.x, this.startPos.y);
	game.context.lineTo(this.endPos.x, this.endPos.y);
	game.context.stroke();
	game.context.closePath();
	game.context.restore();
};

/**************************
*****  TEXTURE CLASS  *****
**************************/
function Texture (pos, size, fillColor, lineWidth, lineColor)  {
	this.pos		= pos;
	this.size		= size;
	this.fillColor	= fillColor;
	this.lineColor	= lineColor;
}

Texture.prototype.update = function (pos) {
	this.pos = pos;
};

Texture.prototype.draw = function () {
	game.context.save();
	game.context.beginPath();
	game.context.rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
	game.context.fillStyle = this.fillColor;
	game.context.fill();
	game.context.lineWidth = this.lineWidth;
	game.context.strokeStyle = this.lineColor;
	game.context.stroke();
	game.context.closePath();
	game.context.restore();
};

/***********************************
*****  TEXTURE GRADIENT CLASS  *****
***********************************/
function TextureGradient (x0, y0, r0, r1, color1, color2) {
	this.x0			= x0;
	this.y0			= y0;
	this.r0			= r0;
	this.x1			= this.x0 + 5;
	this.y1			= this.y0 + 5;
	this.r1			= r1;
	this.color1		= color1;
	this.color2		= color2;
	this.update();
}

TextureGradient.prototype.SetPos = function (pos) {
	this.x0	= pos.x;
	this.y0	= pos.y;
	this.x1	= pos.x + 5;
	this.y1	= pos.y + 5;
	this.update();
};

TextureGradient.prototype.SetSize = function (size) {
	this.r1	= size;
	this.update();
};

TextureGradient.prototype.SetColor = function (color1, color2) {
	this.color1	= color1;
	this.color2	= color2;
	this.update();
};

TextureGradient.prototype.update = function () {
	this.grd		= game.context.createRadialGradient(this.x0, this.y0, this.r0, this.x1, this.y1, this.r1);
	this.grd.addColorStop(0, this.color2);
	this.grd.addColorStop(1, this.color1);
};

TextureGradient.prototype.draw = function () {
	game.context.fillStyle = this.grd;
	game.context.fillRect(0, 0, game.CANVAS_WIDTH, game.CANVAS_HEIGHT);
};

/***********************
*****  TILE CLASS  *****
************************/
function Tile (pos, tileBG, collision) {
	this.pos		= pos;
	this.size		= new Vector2(15, 15);
	this.collision	= collision;
	this.texture	= new Texture(this.pos, this.size, tileBG);
}

Tile.prototype.SetTexture = function (tileBG, collision) {
	this.texture = new Texture(this.pos, this.size, tileBG);
	if (typeof collision !== 'undefined') this.collision = collision;
};

Tile.prototype.draw = function () {
	this.texture.draw();
};

/******************************************
**************  ENEMY CLASS  **************
******************************************/
function Enemy (level, pfGrid) {
	this.level					= level;
	this.pos					= new Vector2(150, 100);
	this.size					= new Vector2(game.SQUARE, game.SQUARE);
	this.velocity				= new Vector2(0, 0);
	this.dir					= '';
	// Constants for controling movement
	this.MoveAcceleration 		= 500.0;
	this.MaxMoveSpeed 			= 3;
	this.MaxWanderSpeed			= 1;
	this.GroundDragFactor 		= 0.38;
	this.movementX 				= 0;
	this.movementY 				= 0;

	this.ray					= {};
	this.texture				= new Texture(this.pos, this.size, '#0088FF');
	this.state					= 'IDLE';	// IDLE, CHASING, SEARCHING
	this.isColliding			= false;

	this.pfGrid					= pfGrid;
	this.pfFinder				= undefined;
	this.pfPath					= [];
	this.pfCounter				= 1;
	this.isFindingPath			= false;

	// Wandering Variables
	this.isWaiting				= false;
	this.waitTimeStart			= 0;
	this.waitTime				= 3;

	// Chasing Variables
	this.isPlayerVisible		= false;

	// Searching Variables
	this.wasPlayerVisible		= false;
	this.lastSeenPlayerPos		= this.level.player.pos;
	this.searchStartTime		= 0;
	this.maxSearchTime			= 3;

	this.selectedTile			= new Texture(new Vector2(-100, -100), new Vector2(game.SQUARE, game.SQUARE), 'transparent', 1, 'yellow');

}

Enemy.prototype.Clamp = function (value, min, max) {
	return (value < min) ? min : ((value > max) ? max : value);
};

Enemy.prototype.SetPos = function (pos) {
	this.pos = pos;
};

Enemy.prototype.CheckRay = function (v0, v1) {
	var p0, p1, dx, dy, nx, ny, sign_x, sign_y, p, distX, distY, dist;
	p0				= new Vector2(Math.floor(v0.x / game.SQUARE), Math.floor(v0.y / game.SQUARE));
	p1				= new Vector2(Math.floor(v1.x / game.SQUARE), Math.floor(v1.y / game.SQUARE));
	dx				= p1.x - p0.x;
	dy				= p1.y - p0.y;
	nx				= Math.abs(dx);
	ny				= Math.abs(dy);
	sign_x			= (dx > 0) ? 1 : -1;
	sign_y			= (dy > 0) ? 1 : -1;
	p				= new Vector2(p0.x, p0.y);

	for (ix = 0, iy = 0; ix < nx || iy < ny;) {

		if ((0.5+ix) / nx < (0.5+iy) / ny) {
			// next step is horizontal
			p.x += sign_x;
			ix++;
		} else {
			// next step is vertical
			p.y += sign_y;
			iy++;
		}

		// If we hit a wall tile, abort - we can't see the player.
		if (this.level.GetTileCollision(p.x, p.y) == 'IMPASSABLE') {
			distX	= (p0.x - p.x);
			distY	= (p0.y - p.y);
			dist	= Math.sqrt(distX*distX + distY*distY);
			return {'HitWall': true, 'length': Math.abs(dist), 'x': p.x, 'y': p.y};
		}

	}

	// We reached our destination without hitting a wall
	return {'HitWall': false};
};

Enemy.prototype.FindPath = function (p1, p2) {
	var i1, i2, grid, p;

	this.pfPath			= [];
	this.pfFinder		= undefined;

	i1 					= new Vector2(Math.floor(p1.x / game.SQUARE), Math.floor(p1.y / game.SQUARE));
	i2					= new Vector2(Math.floor(p2.x / game.SQUARE), Math.floor(p2.y / game.SQUARE));

	grid 				= this.pfGrid.clone();
	this.pfFinder		= new PF.AStarFinder({allowDiagonal: true, dontCrossCorners: true});
	this.pfPath			= this.pfFinder.findPath(i1.x, i1.y, i2.x, i2.y, grid);

	this.isFindingPath	= true;
};

Enemy.prototype.FollowPath = function (gameTime) {
	var pathCoords, dX, dY, mX, mY;

	if (typeof this.pfPath[this.pfCounter] == 'undefined') {
		this.isFindingPath 	= false;
		this.pfCounter 		= 1;
		//if (this.isSearching) this.wasPlayerVisible = false;
	} else {
		pathCoords	= new Vector2((this.pfPath[this.pfCounter][0] * game.SQUARE), (this.pfPath[this.pfCounter][1] * game.SQUARE));
		dX 			= this.pos.x - pathCoords.x;
		dY 			= this.pos.y - pathCoords.y;
		mX 			= 0;
		mY 			= 0;

		// Because it's possible for the enemy to not be able to reach a point on the path (skips over it due to speed)
		// We need to check for it and correct it so he can continue.
		if (this.state != 'IDLE') {
			if (dX < this.MaxMoveSpeed && dX > -this.MaxMoveSpeed) {
				dX	= 0;
			}
			if (dY < this.MaxMoveSpeed && dY > -this.MaxMoveSpeed) {
				dY	= 0;
			}
		}

		// Based on the distance between the enemy's x coords and the path's x coord, adjust the horizontal movement
		if (dX < 0) {
			// Move right
			mX 			= 1;
			this.dir 	= 'E';
		} else if (dX > 0) {
			// Move left
			mX 			= -1;
			this.dir 	= 'W';
		}
		// Based on the distance between the enemy's y coords and the path's y coord, adjust the vertical movement
		if (dY < 0) {
			// Move down
			mY 			= 1;
			this.dir	= (mX > 0) ? 'SE' : (mX < 0 ? 'SW' : 'S');
		} else if (dY > 0) {
			// Move up
			mY 			= -1;
			this.dir 	= (mX > 0) ? 'NE' : (mX < 0 ? 'NW' : 'N');
		}

		// If movement multipliers are 0, we've reached the end of this node
		if (mX == 0 && mY == 0) {
			// If our counter is still less than the length of our path array, increment the counter by 1
			if (this.pfCounter < (this.pfPath.length - 1)) {
				this.pfCounter++;
			} else {
				// Else we've reached the final destination. Stop pathfinding and reset counter for the next time.
				this.isFindingPath = false;
				this.pfCounter = 1;
				if (this.isSearching) this.wasPlayerVisible = false;
				// Give the enemy a 25% chance to pause for a couple seconds before wandering again
				if (this.isSearching || random(0, 100) <= 25) {
					this.isWaiting		= true;
					this.waitTimeStart	= gameTime;
					this.waitTime		= (this.isSearching) ? 1 : random(2, 10);	// Only wait for 1 seconds after searching
				}
			}
		} else {
			// Else the player has reached the end of this node. Move accordingly.
			this.movementX = mX;
			this.movementY = mY;
		}
	}

};

Enemy.prototype.Chase = function () {
	var x, y, offset;

	x = this.pos.x - this.level.player.pos.x;
	y = this.pos.y - this.level.player.pos.y;

	if (x < -3) {
		this.movementX 	= 1;
		this.dir		= 'E';
	} else if (x > 3) {
		this.movementX 	= -1;
		this.dir		= 'W';
	}

	if (y < -3) {
		this.movementY 	= 1;
		this.dir		= (this.movementX > 0) ? 'SE' : (this.movementX < 0 ? 'SW' : 'S');
	} else if (y > 3) {
		this.movementY 	= -1;
		this.dir		= (this.movementX > 0) ? 'NE' : (this.movementX < 0 ? 'NW' : 'N')
	}
};

Enemy.prototype.Wander = function (gameTime) {
	var destTile, clonedGrid;

	if (this.isWaiting && (gameTime - this.waitTimeStart) >= this.waitTime) {
		this.isWaiting = false;
	}

	if (!this.isWaiting) {
		if (!this.isFindingPath) {
			destTile 				= this.level.GetRandomTile();
			this.FindPath(this.pos, new Vector2(destTile.coords.x * game.SQUARE, destTile.coords.y * game.SQUARE));
		} else {
			this.FollowPath(gameTime);
		}
	}

};

Enemy.prototype.Search = function (gameTime) {

	if (!this.isFindingPath) {
		this.FindPath(this.pos, this.lastPlayerPos);
		//this.selectedTile.update(new Vector2(this.lastPlayerPos.x, this.lastPlayerPos.y));
	} else {
		this.FollowPath(gameTime);
	}
};

Enemy.prototype.HandleCollision = function (gameTime) {
	// Set local variables
	var i, j, bottom, localBoundsRect, tileSize, topTile, leftTile, bottomTile, rightTile, tile, tileRect, depth, absDepthX, abdDepthY, playerRect, playerIntersect, collideArr;

	// Prevent leaving the screen bounds (X AXIS)
	if (this.pos.x < 0) {
		this.pos.x = 0;
	} else if ((this.pos.x + this.size.x) > game.CANVAS_WIDTH) {
		this.pos.x = (game.CANVAS_WIDTH - this.size.x);
	}

	// Prevent leaving the screen bounds (Y AXIS)
	if (this.pos.y < 0) {
		this.pos.y = 0;
	} else if ((this.pos.y + this.size.y) > game.CANVAS_HEIGHT) {
		this.pos.y = (game.CANVAS_HEIGHT - this.size.y);
	}

	// Set bouding box for our enemy
	localBoundsRect = new Rectangle(this.pos.x, this.pos.y, this.size.x, this.size.y);
	// Set bounding box for our player
	playerRect		= new Rectangle(this.level.player.pos.x, this.level.player.pos.y, this.level.player.size.x, this.level.player.size.y);
	playerIntersect	= RectangleExtensions.GetIntersectionDepth(localBoundsRect, playerRect);

	if (Math.abs(playerIntersect.x) > (game.SQUARE / 2) && Math.abs(playerIntersect.y) > (game.SQUARE / 2)) {
		this.level.PlayerDead();
	} else {

		// Set the tile size (hard coded)
		tileSize		= new Vector2(game.SQUARE, game.SQUARE);

		// Get the closest tiles
		topTile			= parseInt(Math.floor(parseFloat(localBoundsRect.top / tileSize.y)), 10);
		leftTile		= parseInt(Math.floor(parseFloat(localBoundsRect.left / tileSize.x)), 10);
		bottomTile		= parseInt(Math.ceil(parseFloat(localBoundsRect.bottom / tileSize.y)) - 1, 10);
		rightTile		= parseInt(Math.ceil(parseFloat(localBoundsRect.right / tileSize.x)) - 1, 10);

		collideArr		= [];

		// Loop through each potentially colliding tile
		for (i = topTile; i <= bottomTile; ++i) {
			for (j = leftTile; j <= rightTile; ++j) {

				// Put the tile we're looping on in a variable for multiple use
				tile = this.level.tiles[i][j];
				// Create a bounding box for our tile
				tileRect = new Rectangle(tile.pos.x, tile.pos.y, tileSize.x, tileSize.y);

				// Check if this tile is collidable. Else, check if it's the exit tile
				if (tile.collision === 'IMPASSABLE') {


					// Now we know that this tile is being collided with, we'll figure out
					// the axis of least separation and push the player out along that axis

					// Get the intersection depths between the player and this tile
					depth = RectangleExtensions.GetIntersectionDepth(localBoundsRect, tileRect);

					// Only continue if depth != 0
					if (depth.x !== 0 && depth.y !== 0) {

						absDepthX = Math.abs(depth.x);
						absDepthY = Math.abs(depth.y);

						// If the Y depth is shallower than the X depth, correct player's y position and set y velocity to 0.
						// If the X depth is shallower, correct player's x position and set x velocity to 0.
						// Else, we've hit a corner (both intersection depths are equal). Correct both axes and set velocity to 0
						if (absDepthY < absDepthX) {
							this.pos.y = localBoundsRect.top + depth.y;
							this.velocity.y = 0;
						} else if (absDepthX < absDepthY) {
							this.pos.x = localBoundsRect.left + depth.x;
							this.velocity.x = 0;
						}

						collideArr.push(true);

					}

				} else {
					collideArr.push(false);
				}

			}
		}

		this.isColliding = (collideArr.indexOf(true) != -1);

	}
};

Enemy.prototype.ApplyPhysics = function (gameTime) {
	var moveSpeed, maxSpeed;

	moveSpeed 	= (this.state == 'IDLE') ? moveSpeed = this.MaxWanderSpeed : this.MaxMoveSpeed;
	maxSpeed	= (this.movementX !== 0 && this.movementY !== 0) ? moveSpeed * 0.707107 : moveSpeed;

	this.velocity.x		+= this.movementX * this.MoveAcceleration;
	this.velocity.y		+= this.movementY * this.MoveAcceleration;

	// Apply pseudo-drag horizontally
	this.velocity.x 	*= this.GroundDragFactor;
	this.velocity.y 	*= this.GroundDragFactor;

	// Prevent player from going faster than top speed
	this.velocity.x 	= this.Clamp(this.velocity.x, -maxSpeed, maxSpeed);
	this.velocity.y 	= this.Clamp(this.velocity.y, -maxSpeed, maxSpeed);

	// Apply velocity to player
	this.pos.x 			+= Math.round(this.velocity.x);
	this.pos.y 			+= Math.round(this.velocity.y);

	// Handle Collisions
	this.HandleCollision();

};

Enemy.prototype.update = function (gameTime) {
	var enemyCenter, playerCenter;
	enemyCenter					= new Vector2(this.pos.x + (this.size.x / 2), this.pos.y + (this.size.y / 2));
	playerCenter				= new Vector2(this.level.player.pos.x + (this.level.player.size.x / 2), this.level.player.pos.y + (this.level.player.size.y / 2));

	this.isPlayerVisible 		= (!this.CheckRay(enemyCenter, playerCenter).HitWall);

	if (this.isPlayerVisible) {
		this.state 				= 'CHASING';
		this.wasPlayerVisible 	= true;
		this.isFindingPath		= false;
		this.lastPlayerPos 		= new Vector2(this.level.player.pos.x, this.level.player.pos.y);
		this.level.SetAlarm('CHASE');
		this.Chase();
	} else if (this.wasPlayerVisible) {
		if (!this.isSearching) this.searchStartTime = gameTime;
		this.isSearching 		= true;
		this.state 				= 'SEARCHING';
		this.level.SetAlarm('SEARCH');
		this.Search(gameTime);
	} else {
		this.wasPlayerVisible 	= false;
		this.state 				= 'IDLE';
		this.level.SetAlarm('NORMAL');
		this.Wander(gameTime);
	}

	this.ApplyPhysics();

	// Update the player
	this.texture.update(this.pos);

	// Clear
	this.movementX 				= 0;
	this.movementY 				= 0;

};

Enemy.prototype.draw = function () {
	var l;

	// Draw player texture
	this.texture.draw();

	this.selectedTile.draw();
};

/*******************************************
**************  PLAYER CLASS  **************
*******************************************/
function Player (level) {
	this.level					= level;
	this.pos					= new Vector2(150, 100);
	this.size					= new Vector2(game.SQUARE, game.SQUARE);
	this.velocity				= new Vector2(0, 0);
	// Constants for controling movement
	this.MoveAcceleration 		= 500.0;
	this.MaxMoveSpeed 			= 4;
	this.GroundDragFactor 		= 0.38;
	this.movementX 				= 0;
	this.movementY 				= 0;

	this.texture				= new Texture(this.pos, this.size, '#FFFFFF');
}

Player.prototype.Clamp = function (value, min, max) {
	return (value < min) ? min : ((value > max) ? max : value);
};

Player.prototype.SetPos = function (pos) {
	this.pos = pos;
};

Player.prototype.GetInput = function () {

	// Horizontal Movement
	if (Input.Keys.GetKey(Input.Keys.A)) {
		this.movementX = -1.0;
	} else if (Input.Keys.GetKey(Input.Keys.D)) {
		this.movementX = 1.0;
	}

	// Vertical Movement
	if (Input.Keys.GetKey(Input.Keys.W)) {
		this.movementY = -1.0;
	} else if (Input.Keys.GetKey(Input.Keys.S)) {
		this.movementY = 1.0;
	}

};

Player.prototype.HandleCollision = function (gameTime) {
	// Set local variables
	var i, j, bottom, localBoundsRect, tileSize, topTile, leftTile, bottomTile, rightTile, tile, tileRect, depth, absDepthX, abdDepthY;

	// Prevent leaving the screen bounds (X AXIS)
	if (this.pos.x < 0) {
		this.pos.x = 0;
	} else if ((this.pos.x + this.size.x) > game.CANVAS_WIDTH) {
		this.pos.x = (game.CANVAS_WIDTH - this.size.x);
	}

	// Prevent leaving the screen bounds (Y AXIS)
	if (this.pos.y < 0) {
		this.pos.y = 0;
	} else if ((this.pos.y + this.size.y) > game.CANVAS_HEIGHT) {
		this.pos.y = (game.CANVAS_HEIGHT - this.size.y);
	}

	// Set bouding box for our player
	localBoundsRect = new Rectangle(this.pos.x, this.pos.y, this.size.x, this.size.y);

	// Set the tile size (hard coded)
	tileSize		= new Vector2(game.SQUARE, game.SQUARE);

	// Get the closest tiles
	topTile			= parseInt(Math.floor(parseFloat(localBoundsRect.top / tileSize.y)), 10);
	leftTile		= parseInt(Math.floor(parseFloat(localBoundsRect.left / tileSize.x)), 10);
	bottomTile		= parseInt(Math.ceil(parseFloat(localBoundsRect.bottom / tileSize.y)) - 1, 10);
	rightTile		= parseInt(Math.ceil(parseFloat(localBoundsRect.right / tileSize.x)) - 1, 10);

	// Loop through each potentially colliding tile
	for (i = topTile; i <= bottomTile; ++i) {
		for (j = leftTile; j <= rightTile; ++j) {

			// Put the tile we're looping on in a variable for multiple use
			tile = this.level.tiles[i][j];
			// Create a bounding box for our tile
			//tileRect = {'left': tile.pos.x, 'top': tile.pos.y, 'right': tile.pos.x + tileSize.x, 'bottom': tile.pos.y + tileSize.y, 'Width': tileSize.x, 'Height': tileSize.y};
			tileRect = new Rectangle(tile.pos.x, tile.pos.y, tileSize.x, tileSize.y);

			// Check if this tile is collidable. Else, check if it's the exit tile
			if (tile.collision === 'IMPASSABLE') {


				// Now we know that this tile is being collided with, we'll figure out
				// the axis of least separation and push the player out along that axis

				// Get the intersection depths between the player and this tile
				depth = RectangleExtensions.GetIntersectionDepth(localBoundsRect, tileRect);

				// Only continue if depth != 0
				if (depth.x !== 0 && depth.y !== 0) {

					absDepthX = Math.abs(depth.x);
					absDepthY = Math.abs(depth.y);

					// If the Y depth is shallower than the X depth, correct player's y position and set y velocity to 0.
					// If the X depth is shallower, correct player's x position and set x velocity to 0.
					// Else, we've hit a corner (both intersection depths are equal). Correct both axes and set velocity to 0
					if (absDepthY < absDepthX) {
						//this.pos.y += depth.y;
						this.pos.y = localBoundsRect.top + depth.y;
						this.velocity.y = 0;
					} else if (absDepthX < absDepthY) {
						//this.pos.x += depth.x;
						this.pos.x = localBoundsRect.left + depth.x;
						this.velocity.x = 0;
					} /*else {
						this.pos = {'x': this.pos.x + depth.x, 'y': this.pos.y + depth.y};
					}*/

				}

			} else if (tile.collision === 'EXIT') {

				// Get the intersection depths between the player and this tile
				depth = RectangleExtensions.GetIntersectionDepth(localBoundsRect, tileRect);

				// Only allow exit if player's majority is over the exit tile
				if (Math.abs(depth.x) > (game.SQUARE / 2) && Math.abs(depth.y) > (game.SQUARE / 2))
					this.level.FoundExit(gameTime);

			}

		}
	}
};

Player.prototype.ApplyPhysics = function (gameTime) {
	var maxSpeed;

	// Correct move speed if moving diagonally
	if (this.movementX !== 0 && this.movementY !== 0)
		maxSpeed = this.MaxMoveSpeed * 0.85;
	else
		maxSpeed = this.MaxMoveSpeed

	this.velocity.x		+= this.movementX * this.MoveAcceleration;
	this.velocity.y		+= this.movementY * this.MoveAcceleration;

	// Apply pseudo-drag horizontally
	this.velocity.x 	*= this.GroundDragFactor;
	this.velocity.y 	*= this.GroundDragFactor;

	// Prevent player from going faster than top speed
	this.velocity.x 	= this.Clamp(this.velocity.x, -maxSpeed, maxSpeed);
	this.velocity.y 	= this.Clamp(this.velocity.y, -maxSpeed, maxSpeed);

	// Apply velocity to player
	this.pos.x 			+= Math.round(this.velocity.x);
	this.pos.y 			+= Math.round(this.velocity.y);

	// Handle Collisions
	this.HandleCollision();

};

Player.prototype.update = function () {

	this.GetInput();
	this.ApplyPhysics();

	// Update the player
	this.texture.update(this.pos);

	// Clear inputs
	this.movementX = 0;
	this.movementY = 0;

};

Player.prototype.draw = function () {
	// Draw player texture
	this.texture.draw();
};

/**********************
*****  CONTAINER  *****
**********************/

function Container (x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.center = new Vector2(Math.floor(this.x + (this.w/2)), Math.floor(this.y + (this.h/2))); // Must be a whole number as we're working with tiles
}

/*****************
*****  TREE  *****
*****************/

function Tree (leaf) {
    this.leaf 	= leaf;
    this.lchild = undefined;
    this.rchild = undefined;
}

Tree.prototype.getLeafs = function() {
    if (this.lchild === undefined && this.rchild === undefined)
        return [this.leaf];
    else
        return [].concat(this.lchild.getLeafs(), this.rchild.getLeafs());
};

Tree.prototype.getLevel = function(level, queue) {
    if (queue === undefined)
        queue = [];
    if (level == 1) {
        queue.push(this);
    } else {
        if (this.lchild !== undefined)
            this.lchild.getLevel(level-1, queue);
        if (this.rchild !== undefined)
            this.rchild.getLevel(level-1, queue);
    }
    return queue;
};

/*****************
*****  ROOM  *****
*****************/
function Room (container) {
	this.x	= container.x + random(0, Math.floor(container.w/3));
	this.y	= container.y + random(0, Math.floor(container.h/3));
	this.w	= container.w - (this.x - container.x);
	this.h	= container.h - (this.y - container.y);
	this.w -= random(0, this.w/3);
	this.h -= random(0, this.w/3);
}

/*****************
*****  HALL  *****
*****************/
function Hall (lchild, rchild) {
	var isSplitHorizontal;
	isSplitHorizontal	= (lchild.x != rchild.x);
	this.x				= lchild.center.x;
	this.y				= lchild.center.y;
	this.w				= (isSplitHorizontal) ? rchild.center.x - lchild.center.x : 1;
	this.h				= (isSplitHorizontal) ? 1 : rchild.center.y - lchild.center.y;
}

/******************
*****  LEVEL  *****
******************/
function Level () {
	// Dungeon Generation
	this.N_ITERATIONS		= 4;
	this.DISCARD_BY_RATIO	= true;
	this.H_RATIO			= 0.45;
	this.W_RATIO			= 0.45;
	this.main_container		= {};
	this.container_tree		= [];
	this.leafs				= [];
	this.tiles				= [];
	this.exitTile			= undefined;
	this.startTile			= undefined;
	this.rooms				= [];
	this.halls				= [];
	// Player
	this.player				= new Player(this);
	this.enemy				= [];
	// Level Variables
	this.fps				= 0;
	this.overlay			= new TextureGradient(this.player.pos.x, this.player.pos.y, 10, 75, 'black', 'rgba(0, 0, 0, 0)');	//x0, y0, r0, x1, y1, r1, color1, color2
	this.showOverlay		= false;
	this.showDebug			= false;
	this.isOneLocked		= false;
	this.OneLockStart		= 0;
	this.isLoading			= true;
	this.foundExit			= false;
	this.levelStartTime		= 0;
	this.elapsedTime		= 0;
	this.reloadTimer		= 0;
	this.rounds				= 0;
	this.score				= 0;
	this.exits				= 0;
	this.deaths				= 0;
	this.showDeadMsg		= false;
	this.deadMsgTimer		= 0;

	this.pfGrid				= [];

	// Initialize
	this.Initialize();
}

Level.prototype.Initialize = function () {
	var eRnd, e;
	// Level Generation
	this.main_container		= new Container(0, 0, game.MAP_SIZE_X, (game.canvas.height / game.SQUARE));
	this.container_tree		= this.split_container(this.main_container, this.N_ITERATIONS);
	this.leafs				= this.container_tree.getLeafs();
	this.pfGrid				= new PF.Grid(game.MAP_SIZE_X, game.MAP_SIZE_Y);
	this.LoadEmptyTiles();
	this.CreateRooms();
	this.CreateHalls(this.container_tree);
	this.CarveTiles();

	// Initialize timer
	this.levelStartTime		= new Date().getTime() / 1000;

	// Initialize Enemies
	this.enemy = [];
	eRnd = random(1, 3);
	for (e = 0; e < eRnd; e++) {
		this.enemy.push(new Enemy(this, this.pfGrid));
	}

	this.rounds++;

	this.SetSpecialTiles();
};

Level.prototype.DrawText = function (string, x, y, font, color) {
	game.context.save();
	game.context.font = font;
	game.context.fillStyle = color;
	game.context.fillText(string, x, y);
	game.context.restore();
};

Level.prototype.LoadEmptyTiles = function () {
	var i, j, x, y, tileBG;
	for (i = 0; i < game.MAP_SIZE_Y; i++) {
		this.tiles[i] = [];
		for (j = 0; j < game.MAP_SIZE_X; j++) {
			x = j * game.SQUARE;
			y = i * game.SQUARE;
			this.tiles[i][j] = new Tile(new Vector2(x, y), '#000000', 'IMPASSABLE');
			this.pfGrid.setWalkableAt(j, i, false);
		}
	}
};

Level.prototype.Reset = function (gameTime) {
	this.isLoading			= true;
	this.tiles				= [];
	this.leafs				= [];
	this.rooms				= [];
	this.halls	 			= [];
	this.main_container		= {};
	this.container_tree		= [];
	this.leafs				= [];
	this.pfGrid				= [];

	this.Initialize();
};

Level.prototype.SetDifficulty = function (difficulty) {
	if (parseInt(difficulty, 10) === 0 || typeof difficulty === 'undefined') {
		this.showOverlay = false;
	} else {
		this.overlay.SetSize(difficulty * 75);
		this.showOverlay = true;
	}
};

Level.prototype.SetAlarm = function (type) {
	if (this.showOverlay) {

		if (type == 'CHASE') {
			this.overlay.SetColor('black', 'rgba(50, 0, 0, 0)');
		} else if (type == 'SEARCH') {
			this.overlay.SetColor('black', 'rgba(50, 50, 0, 0)');
		} else {
			this.overlay.SetColor('black', 'rgba(0, 0, 0, 0)');
		}

	}
};

Level.prototype.split_container = function (container, iter) {
	var root, sr;
	root = new Tree(container);
	if (iter !== 0) {
		try {
			sr 		= this.random_split(container);
		} catch (e) {
			this.Reset();
		}
		root.lchild = this.split_container(sr[0], iter-1);
		root.rchild = this.split_container(sr[1], iter-1);
	}
    return root;
};

Level.prototype.random_split = function (container) {
	var r1, r2, r1_w_ratio, r2_w_ratio, r1_h_ratio, r2_h_ratio;
	if (random(0, 1) === 0) {
		// Vertical
		r1 = new Container(
			container.x, container.y,             // r1.x, r1.y
			random(1, container.w), container.h   // r1.w, r1.h
		);
		r2 = new Container(
			container.x + r1.w, container.y,      // r2.x, r2.y
			container.w - r1.w, container.h       // r2.w, r2.h
		);

		if (this.DISCARD_BY_RATIO) {
			r1_w_ratio = r1.w / r1.h;
			r2_w_ratio = r2.w / r2.h;
			if (r1_w_ratio < this.W_RATIO || r2_w_ratio < this.W_RATIO) {
				return this.random_split(container);
			}
		}
	} else {
		// Horizontal
		r1 = new Container(
			container.x, container.y,             // r1.x, r1.y
			container.w, random(1, container.h)   // r1.w, r1.h
		);
		r2 = new Container(
			container.x, container.y + r1.h,      // r2.x, r2.y
			container.w, container.h - r1.h       // r2.w, r2.h
		);

		if (this.DISCARD_BY_RATIO) {
			r1_h_ratio = r1.h / r1.w;
			r2_h_ratio = r2.h / r2.w;
			if (r1_h_ratio < this.H_RATIO || r2_h_ratio < this.H_RATIO) {
				return this.random_split(container);
			}
		}
	}
    return [r1, r2];
};

Level.prototype.CreateRooms = function () {
	var i;
	for (i = 0; i < this.leafs.length; i++) {
		this.rooms.push(new Room(this.leafs[i]));
	}
};

Level.prototype.CreateHalls = function (tree) {
	if (tree.lchild == undefined || tree.rchild == undefined)
		return;
	this.halls.push(new Hall(tree.lchild.leaf, tree.rchild.leaf));
	this.CreateHalls(tree.lchild);
	this.CreateHalls(tree.rchild);
};

Level.prototype.CarveTiles = function () {
	var i, j, k, rooms, halls, tileBG;

	// Carve Rooms
	for (i = 0; i < this.rooms.length; i++) {
		room = this.rooms[i];
		for (j = room.y; j < (room.y + room.h); j++) {
			for (k = room.x; k < (room.x + room.w); k++) {
				tileBG = 'rgb(' + Math.floor((Math.random() * 50) + 10) + ', ' + Math.floor((Math.random() * 50) + 10) + ', ' + Math.floor((Math.random() * 50) + 10) + ')';
				this.tiles[j][k].SetTexture(tileBG, 'PASSABLE');
				this.pfGrid.setWalkableAt(k, j, true);
			}
		}
	}

	// Carve Halls
	for (i = 0; i < this.halls.length; i++) {
		hall = this.halls[i];
		for (j = hall.y; j < (hall.y + hall.h); j++) {
			for (k = hall.x; k < (hall.x + hall.w); k++) {
				tileBG = 'rgb(' + Math.floor((Math.random() * 50) + 10) + ', ' + Math.floor((Math.random() * 50) + 10) + ', ' + Math.floor((Math.random() * 50) + 10) + ')';
				this.tiles[j][k].SetTexture(tileBG, 'PASSABLE');
				this.pfGrid.setWalkableAt(k, j, true);
			}
		}
	}

};

Level.prototype.GetRandomTile = function () {
	var rRnd, room, rX, rY;

	rRnd	= random(0, (this.rooms.length - 1));
	room 	= this.rooms[rRnd];
	rX 		= random(room.x + 1, (room.x + room.w) - 1);
	rY 		= random(room.y + 1, (room.y + room.h) - 1);
	return {room: rRnd, coords: new Vector2(rX, rY)};

};

Level.prototype.SetSpecialTiles = function () {
	var pStartTile, exitTile, e, enemyStartTile;

	// Player Start Tile
	pStartTile		= this.GetRandomTile();
	this.startTile 	= this.tiles[pStartTile.coords.y][pStartTile.coords.x];
	this.player.pos = new Vector2(pStartTile.coords.x * game.SQUARE, pStartTile.coords.y * game.SQUARE);
	this.player.update();
	this.overlay.SetPos(new Vector2(this.player.pos.x, this.player.pos.y));

	// Enemy Start Tiles
	for (e = 0; e < this.enemy.length; e++) {
		enemyStartTile = this.GetRandomTile();
		while (enemyStartTile.room == pStartTile.room) {
			enemyStartTile = this.GetRandomTile();
		}
		this.enemy[e].pos = new Vector2(enemyStartTile.coords.x * game.SQUARE, enemyStartTile.coords.y * game.SQUARE);
	}

	// Exit Tile
	exitTile		= this.GetRandomTile();
	while (exitTile.room == pStartTile.room) {
		exitTile = this.GetRandomTile();
	}
	this.exitTile 	= this.tiles[exitTile.coords.y][exitTile.coords.x];
	this.exitTile.SetTexture('#FF8800', 'EXIT');

};

Level.prototype.FoundExit = function () {
	this.score += ((this.elapsedTime <= 10) ? 200 : (this.elapsedTime <= 20) ? 100 : 50);
	this.exits++;
	this.Reset();
};

Level.prototype.PlayerDead = function () {
	this.score -= 500;
	this.deaths++;
	this.showDeadMsg = true;
	this.deadMsgTimer = new Date().getTime() / 1000;
	this.Reset();
};

Level.prototype.GetTileCollision = function (x, y) {
	if (x < 0 || x >= game.MAP_SIZE_X || y < 0 || y >= game.MAP_SIZE_Y) return 'IMPASSABLE';
	return this.tiles[y][x].collision;
};

Level.prototype.update = function () {
	var gameTime, i;
	gameTime			= new Date().getTime() / 1000;
	this.elapsedTime	= Math.floor(gameTime - this.levelStartTime);

	this.fps = fps.getFPS();

	// clear key locks
	if (this.isLoading && (gameTime - this.reloadTimer) >= 0.5) this.isLoading = false;
	if (this.isSpaceLocked && (gameTime - this.spaceLockTime) >= 0.5) this.isSpaceLocked = false;
	if (this.isOneLocked && (gameTime - this.OneLockStart) >= 0.5) this.isOneLocked = false;

	// clear dead message
	if (this.showDeadMsg && (gameTime - this.deadMsgTimer) >= 3) this.showDeadMsg = false;

	/* Check for keyboard input */
	// Reload (R)
	if (Input.Keys.GetKey(Input.Keys.R) && !this.isLoading) {
		this.Reset();
		this.reloadTimer = gameTime;
	}
	// Debug Information (ONE)
	if (Input.Keys.GetKey(Input.Keys.ONE) && !this.isOneLocked) {
		this.OneLockStart 	= gameTime;
		this.isOneLocked	= true;
		this.showDebug		= (this.showDebug) ? false : true;
	}

	// Update the player
	if (!this.isLoading) {
		this.overlay.SetPos({'x': this.player.pos.x, 'y': this.player.pos.y});
		this.player.update();
		for (i = 0; i < this.enemy.length; i++) {
			this.enemy[i].update(gameTime);
		}
	}
};

Level.prototype.draw = function () {
	var i, j, e, startY;

	// TILES
	for (i = 0; i < this.tiles.length; i++) {
		for (j = 0; j < this.tiles[i].length; j++) {
			this.tiles[i][j].draw();
		}
	}

	for (e = 0; e < this.enemy.length; e++) {
		this.enemy[e].draw();
	}

	if (this.showOverlay) this.overlay.draw();
	this.player.draw();

	// Debug
	if (this.showDebug) {
		// ENEMIES
		for (e = 0; e < this.enemy.length; e++) {
			startY = 70 * (e + 1);
			this.DrawText('Enemy #' + (e + 1), 5, startY, 'bold 10pt Century Gothic', 'rgba(255, 255, 255, 0.7)');
			this.DrawText('Position: ' + this.enemy[e].pos.x + 'x, ' + this.enemy[e].pos.y + 'y', 5, startY + 13, 'normal 9pt Century Gothic', 'rgba(255, 255, 255, 0.7)');
			this.DrawText('Direction: ' + this.enemy[e].dir, 5, startY + 26, 'normal 9pt Century Gothic', 'rgba(255, 255, 255, 0.7)');
			this.DrawText('State: ' + this.enemy[e].state, 5, startY + 39, 'normal 9pt Century Gothic', 'rgba(255, 255, 255, 0.7)');
			this.DrawText('Waiting: ' + this.enemy[e].isWaiting, 5, startY + 52, 'normal 9pt Century Gothic', 'rgba(255, 255, 255, 0.7)');
		}
		if (this.enemy.length > 4) {
			this.DrawText('And ' + (this.enemy.length - 4) + ' more enemies...', 5, 355, 'normal 9pt Century Gothic', 'rgba(255, 255, 255, 0.7)');
		}

		// GENERAL INFO
		this.DrawText('Tiles: ' + (this.tiles.length * this.tiles[0].length), (game.CANVAS_WIDTH - 70), 63, 'normal 9pt Century Gothic', 'rgba(255, 255, 255, 0.7)');
		this.DrawText('Rooms: ' + this.rooms.length, (game.CANVAS_WIDTH - 70), 76, 'normal 9pt Century Gothic', 'rgba(255, 255, 255, 0.7)');
		this.DrawText('Enemies: ' + this.enemy.length, (game.CANVAS_WIDTH - 70), 89, 'normal 9pt Century Gothic', 'rgba(255, 255, 255, 0.7)');
		this.DrawText('Round: ' + this.rounds, (game.CANVAS_WIDTH - 70), 102, 'normal 9pt Century Gothic', 'rgba(255, 255, 255, 0.7)');
		this.DrawText('Exits: ' + this.exits, (game.CANVAS_WIDTH - 70), 115, 'normal 9pt Century Gothic', 'rgba(255, 255, 255, 0.7)');
		this.DrawText('Deaths: ' + this.deaths, (game.CANVAS_WIDTH - 70), 128, 'normal 9pt Century Gothic', 'rgba(255, 255, 255, 0.7)');
	}

	// Draw Score
	this.DrawText('SCORE: ' + this.score, 5, 20, 'normal 14pt Century Gothic', 'rgba(255, 255, 255, 0.7)');

	// Draw FPS
	this.DrawText('FPS: ' + this.fps, ((game.CANVAS_WIDTH / 2) - 40), 20, 'normal 14pt Century Gothic', 'rgba(255, 255, 255, 0.7)');

	// Draw Timer
	this.DrawText('TIMER: ' + SecondsToTime(this.elapsedTime), game.CANVAS_WIDTH - 106, 20, 'normal 14pt Century Gothic', 'rgba(255, 255, 255, 0.7)');

	// Show dead message
	if (this.showDeadMsg) this.DrawText('YOU DIED', (game.CANVAS_WIDTH / 2) - 100, (game.CANVAS_HEIGHT / 2) + 15, 'normal 30pt Century Gothic', 'rgba(128, 0, 0, 0.7)');

};


/*****************
*****  MAIN  *****
*****************/
var game = {
	init: function () {
		var difficultyBtns, i;
		this.isRunning				= true;
		this.FPS					= 30;
		this.CANVAS_WIDTH			= 750;
		this.CANVAS_HEIGHT			= 405;
		this.MAP_SIZE_X				= 50;	// In tiles
		this.MAP_SIZE_Y				= 27;	// In tiles
		this.SQUARE					= 15;
		this.canvas					= document.getElementById('viewport');
		this.context				= this.canvas.getContext('2d');
		this.level					= new Level();
		difficultyBtns				= document.getElementsByClassName('difficultyBtn');

		// Create event listeners
		window.addEventListener('keyup', function (e) { Input.Keys.onKeyUp(e); }, false);
		window.addEventListener('keydown', function (e) { Input.Keys.onKeyDown(e); }, false);

		for (i = 0; i < difficultyBtns.length; i++) {
			difficultyBtns[i].addEventListener('click', game.onDifficultyClick, false);
		}

		// Game Loop
		game.run();
	},
	onDifficultyClick: function () {
		var that;
		that = this;
		document.getElementsByClassName('active')[0].className = "difficultyBtn";
		that.className = "difficultyBtn active";
		game.level.SetDifficulty(that.getAttribute('val'));
	},
	run: function () {
		if (game.isRunning) {
			game.update();
			game.draw();
		}
		requestAnimationFrame(game.run);
		/*setInterval(function () {
			if (game.isRunning) {
				game.update();
				game.draw();
			}
		}, 1000 / game.FPS);*/
	},
	update: function () {
		game.level.update();
	},
	draw: function () {
		game.context.clearRect(0, 0, game.CANVAS_WIDTH, game.CANVAS_HEIGHT);
		game.level.draw();
	}
};