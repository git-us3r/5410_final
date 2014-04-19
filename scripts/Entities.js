///////
//
// _levelParameters is an array of numbers
// the length represents the number of bombs for the level
// the values represent the countdown start number for each bomb.
//
////////////

GAME.NTTS = (function(){

	var ntts = {}
		, sounds = GAME.Sounds.PossibleSounds
		, playsound = GAME.Sounds.playSound
		, images = {}
		, interludeNTTS = {};


	images['BK'] = GAME['images']['images/Background.png'];
	images['BombImage'] = GAME['images']['images/Bomb.png'];
	images['checkMark'] = GAME['images']['images/checkmark.png'];
	images['expMark'] = GAME['images']['images/Explosion.png'];

	images['number1'] = GAME['images']['images/number1.png'];
	images['number2'] = GAME['images']['images/number2.png'];
	images['number3'] = GAME['images']['images/number3.png'];
	images['GO'] = GAME['images']['images/GO.png'];

	images['GlassNumbers'] = [];


	// Side effect: images['GlassNumbers'] will contain the glasse numbers ordered in increasing number.
	// to make it easy to iterate below.
	////
	for (var i = 0; i < 10; i++){

		images['GlassNumbers'].push(GAME['images']['images/glass_numbers_' + i + '.png']);
	}






	function initialize(_levelParameters){

		///////
		// BACKGROUND ... lol
		ntts['BACKGROUND'] = (function(){

			// Background NTT
			var spec = {}
				, _image = images['BK']
				, _width = 1200
				, _height = 600
				, _center = {

					x : 600,
					y : 300
				}
				, _rotation = 0;

			spec = Spec.create(_image, _width, _height, _center, _rotation);

			function render(_graphics){

				_graphics.drawImage(spec);
			};


			function update(_elapsedTime){

				// EMPTY
			}



			return {

				render : render,
				update : update
			};

		}());




		//////
		// BOMBS
		//
		// _levelTimers is an array of numbers representing
		// 1) the number of bombs for the level, by length
		// 2) the countdown start number for each bomb
		//
		/////////
		ntts['BOMBS'] = (function(_levelTimers){

			var bombDimension = 150
				, bombCoverDim = 90
				, positions = [

					{x : 400, y : 200},
					{x : 600, y : 200},
					{x : 800, y : 200},
					{x : 400, y : 400},
					{x : 600, y : 400},
					{x : 800, y : 400}

				]
				, bombs = {};


			function initializeBombs(_levelTimers){

				for(var i = 0; i < _levelTimers.length; i++){

					var glassImages = [];
					for (var countDown = _levelTimers[i]; countDown >= 0; countDown--) {

						glassImages.push(images['GlassNumbers'][countDown]);
					}

					var notificationObject = function(){

						//func : playsound,
						//param : sounds.explosion

						// CHANGE:
						// output to console for now
						console.log('BAM');
					};

					var tempBomb = Bomb.create(notificationObject, images['BombImage']
												, glassImages
												, images['checkMark']
												, images['expMark']
												, bombDimension
												, bombDimension
												, positions[i]
												, 0
												, -1
												, true);

					bombs[tempBomb.id] = tempBomb;
				}
			}

			// call it right now plz
			initializeBombs(_levelTimers);



			function update(_elapsedTime){

				for (var bomb in bombs){
					if(bombs.hasOwnProperty(bomb)){

						bombs[bomb].update(_elapsedTime);
					}
				}
			}




			function render(_graphics){

				for (var bomb in bombs){
					if(bombs.hasOwnProperty(bomb)){

						bombs[bomb].render(_graphics);
					}
				}
			}



			function reset(_levelTimers){

				bombs = {};
				initializeBombs(_levelTimers);

			};

			function on(){

				var over = true;

				// If at least one bomb is on, the leve goes on.
				for(var bomb in bombs){

					if(bombs.hasOwnProperty(bomb)){

						if(bombs[bomb].on()){

							over = false;
							break;
						}
					}
				}

				return over;				
			}


			function checkClick(_clickLocation) {
				
				for(var bomb in bombs){
					if(bombs.hasOwnProperty(bomb)){

						if(bombs[bomb].on()){

							/*
							if(bombs[bomb].hit(_clickLocation)){


								playsound(sounds.hit);
								bombs[bomb].safeRequest = true;
							}
							*/

							// CHANGE:
							// Use the new interface: call hit
							bombs[bomb].hit(_clickLocation);					
						}
					}
				}
			}



			return {

				initializeBombs : initializeBombs,
				update : update,
				render : render,
				reset : reset,
				on : on,
				checkClick : checkClick

			};

		}(_levelParameters));



		ntts['NUMBERS'] = (function(){

			var _images = {0 : images['GO'], 1 : images['number1'], 2 : images['number2'], 3 : images['number3']}
				, _width = 300
				, _height = 300
				, _center = {

					x : 600,
					y : 300
				}
				, _rotation = 0
				, currentImage = 3
				, specWidth = 300
				, specHeight = 300
				, spec;

			spec = Spec.create(_images[3], _width, _height, _center, _rotation);

			function update(_elapsedTime){

				spec.width -= _elapsedTime * specWidth;
				spec.height -= _elapsedTime * specHeight;

				if(spec.width <= 1 || spec.height <= 1){

					spec.width = 300;
					spec.height = 300;

					currentImage--;
					spec.image = _images[currentImage];
				}
			};


			function render(_graphics){

				_graphics.drawImage(spec);
			};


			function restart(){

				spec.width = specWidth;
				spec.height = specHeight;

				currentImage = 3;
				spec.image = _images[currentImage];

			};


			return {

				update : update,
				render : render,
				restart : restart

			};

		}());



		// Register Input object and register click function.
		// ntts['INPUT'] = Input;
		// ntts['INPUT'].registerCommand(ntts['BOMBS'].checkClick);

		return ntts;
	}

	// Expose the initialize method.
	return {

		initialize : initialize,
	};

}());