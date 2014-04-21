var Bomb = (function(){

	var uniqueId = 0;


	// _glassNumbers contains an ordered array with the glass numbers to be used in countdount
	// It is an array of Image objects.

	// Implementing observer pattern to notify explosion or saved for sounds and other stuff
	//////
	function create(_notify, _bombImage, _glassNumbers, _checkMark, _expMark, _width, _height, _center, _rotation, _duration, _visible){

		var bomb = {}
			, secondsRemaining = _glassNumbers.length
			, bombImage = _bombImage
			, checkMark = _checkMark
			, expMark = _expMark
			, duration = _duration
			, currentTime = _duration
			, visible = _visible
			, glassNumbers = _glassNumbers
			, currentGlassNumber = 0
			, currentCover = glassNumbers[currentGlassNumber]
			, maxGlassNumber = glassNumbers.length
			, on = true
			, safe = false
			, safeRequest = false
			, exp = false
			, secondsCtr = 0;


		// Set bomb with spec interface, mark it and increment uniqueId ctr.	
		bomb = Spec.create(_bombImage, _width, _height, _center, _rotation);
		bomb.id = uniqueId;
		uniqueId++;
		


		function update(_elapsedTime){

			secondsCtr += _elapsedTime;

			if(on && secondsCtr > 1){

				secondsCtr = 0;
				secondsRemaining--;

				// Check if it has been clicked.
				if(safeRequest){

					safe = true;
				}


				if(safe){

				 	on = false;
				 	currentCover = checkMark;
				 	_notify('safe', secondsRemaining);
				}
				else if (secondsRemaining >= 0){					
						
					currentGlassNumber++;

					// Check bounds
					if(currentGlassNumber < maxGlassNumber){
						
						currentCover = glassNumbers[currentGlassNumber];
					}
					else{
						// time has expired and the bomb is not safe: explode
						on = false;
						exp = true;
						currentCover = expMark;
						_notify('exp');
					}
				}
				
			}
		}



		// Rendering must happen unconditionally, because the canvas is cleared every frame.
		function render(_graphics){

			_graphics.drawImage(bomb);

			bomb.image = currentCover;
			bomb.width -= 40;
			bomb.height -= 40;
			bomb.center.x += 16;
			bomb.center.y += 14;

			_graphics.drawImage(bomb);

			bomb.image = bombImage;
			bomb.width += 40;
			bomb.height += 40;
			bomb.center.x -= 16;
			bomb.center.y -= 14;
		}


		function hit(_clickLocation){

			var differenceVector = Vector2d.subtract(_clickLocation, bomb.center)
				, differenceVectorMagnitude = Vector2d.magnitude(differenceVector);


			// This works because the bomb is technically square
			//return (differenceVectorMagnitude <= .35 * bomb.width);

			// CHANGE:
			// Encapsulation. This function will notify itself.
			// It will be void.

			// It will become safe during update.
			if((differenceVectorMagnitude <= .35 * bomb.width)){

				safeRequest = true;
			}

		}


		bomb.update = update;
		bomb.render = render;
		bomb.hit = hit;
		bomb.on = function(){return on;};
		bomb.safe = function(){return safe;};
		bomb.getSecondsRemaining = function(){return secondsRemaining;};
		return bomb;
	}

	return {create : create};

}());
//exports.Bomb = Bomb;