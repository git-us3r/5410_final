var Bomb = (function(){

	var uniqueId = 0;

	// _glassNumbers contains an ordered array with the glass numbers to be used in countdount
	// It is an array of Image objects.

	// Implementing observer pattern to notify explosion or saved for sounds and other stuff
	//////
	function create(_notify, _bombImage, _glassNumbers, _checkMark, _expMark, _width, _height, _center, _rotation, _duration, _visible){

		var bomb = Spec.create(_bombImage, _width, _height, _center, _rotation);


		bomb.id = uniqueId;
		uniqueId++;

		bomb.bombImage = _bombImage;
		bomb.checkMark = _checkMark;
		bomb.expMark = _expMark;
		bomb.duration = _duration;
		bomb.currentTime = _duration;
		bomb.visible = _visible;

		bomb.glassNumbers = _glassNumbers;
		bomb.currentGlassNumber = 0;
		bomb.currentCover = bomb.glassNumbers[bomb.currentGlassNumber];
		bomb.maxGlassNumber = _glassNumbers.length;

		bomb.on = true;
		bomb.safe = false;
		bomb.safeRequest = false;
		bomb.exp = false;
		bomb.secondsCtr = 0;
		


		bomb.update = function(_elapsedTime){

			bomb.secondsCtr += _elapsedTime;

			if(bomb.on && bomb.secondsCtr > 1){

				bomb.secondsCtr = 0;

				// Check if it has been clicked.
				if(bomb.safeRequest){

					bomb.safe = true;
				}


				if(bomb.safe){

				 	bomb.on = false;
				 	bomb.currentCover = bomb.checkMark;
				}
				else if (bomb.currentGlassNumber < bomb.maxGlassNumber){					
						
					bomb.currentGlassNumber++;

					// Check bounds
					if(bomb.currentGlassNumber < bomb.maxGlassNumber){
						
						bomb.currentCover = bomb.glassNumbers[bomb.currentGlassNumber];
					}
					else{
						// time has expired and the bomb is not safe: explode
						bomb.on = false;
						bomb.exp = true;
						bomb.currentCover = bomb.expMark;
						_notify.func(_notify.param);
					}
				}
				
			}
		};


		// Rendering must happen unconditionally, because the canvas is cleared every frame.
		bomb.render = function(_graphics){

			_graphics.drawImage(bomb);

			bomb.image = bomb.currentCover;
			bomb.width -= 40;
			bomb.height -= 40;
			bomb.center.x += 16;
			bomb.center.y += 14;

			_graphics.drawImage(bomb);

			bomb.image = bomb.bombImage;
			bomb.width += 40;
			bomb.height += 40;
			bomb.center.x -= 16;
			bomb.center.y -= 14;
		};


		bomb.hit = function(_clickLocation){

			var differenceVector = Vector2d.subtract(_clickLocation, bomb.center)
				, differenceVectorMagnitude = Vector2d.magnitude(differenceVector);


			// This works because the bomb is technically square
			return (differenceVectorMagnitude <= .35 * bomb.width);

		};




		return bomb;
	}

	return {create : create};

}());
exports.Bomb = Bomb;