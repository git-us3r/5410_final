
///////
//
// _levelParameters is an array of numbers
// the length represents the number of bombs for the level
// the values represent the countdown start number for each bomb.
//
////////////

GAME.NTTS = (function(){

	'use strict';

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
	images['loose'] = GAME['images']['images/loose.png'];
	images['win'] = GAME['images']['images/win.png'];

	images['GlassNumbers'] = [];


	// Side effect: images['GlassNumbers'] will contain the glasse numbers ordered in increasing number.
	// to make it easy to iterate below.
	////
	for (var i = 0; i < 10; i++){

		images['GlassNumbers'].push(GAME['images']['images/glass_numbers_' + i + '.png']);
	}






	function initialize(_bombNotify, _levelParameters){

		///////
		// BACKGROUND ... lol
		ntts['BACKGROUND'] = (function(){

			// Background NTT
			var spec = {}
				, minDelay = 1
				, delay = 3
				, midDelay = 2
				, currentDelay = 0
				, interlude = false
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

				if(interlude){

					currentDelay += _elapsedTime;
					if(currentDelay >= minDelay && currentDelay < midDelay){

						spec.width = Math.max(spec.width - _elapsedTime * _width, 0);
						spec.height = Math.max(spec.height - _elapsedTime * _height, 0);
					}
					else if(currentDelay >= midDelay && currentDelay < delay)
					{
						spec.width = Math.min(spec.width - _elapsedTime * _width, 0);
						spec.height = Math.min(spec.height - _elapsedTime * _height, 0);	
					}
					else{

						spec.width = _width;
						spec.height = _height;
					}
				}

			}


			function InterludeOn(){

				interlude = true;

			}


			function ResetBackground(){

				interlude = false;
				currentDelay = 0;

				spec.width = _width;
				spec.height = _height;
				
			}



			return {

				render : render,
				update : update,
				InterludeOn : InterludeOn,
				ResetBackground : ResetBackground
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
		ntts['BOMBS'] = (function(_bombNotify, _levelTimers){

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
				, bombs = {}
				, visible = true;


			function initializeBombs(_bombNotify, _levelTimers){

				//bombs = {};
				//randomize();

				for(var i = 0; i < _levelTimers.length; i++){

					var glassImages = [];
					for (var countDown = _levelTimers[i]; countDown >= 0; countDown--) {

						glassImages.push(images['GlassNumbers'][countDown]);
					}

					var tempBomb = Bomb.create(_bombNotify, images['BombImage']
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
			initializeBombs(_bombNotify, _levelTimers);



			function update(_elapsedTime){

				for (var bomb in bombs){
					if(bombs.hasOwnProperty(bomb)){

						bombs[bomb].update(_elapsedTime);
					}
				}
			}




			function render(_graphics){

				if(visible){

					for (var bomb in bombs){
					
						if(bombs.hasOwnProperty(bomb)){

							bombs[bomb].render(_graphics);
						}
					}
				}
			}



			function reset(_levelTimers){

				bombs = {};
				initializeBombs(_bombNotify, _levelTimers);

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



			function allSafe(){

				var allSafe = true;

				// If at least one bomb is on, the leve goes on.
				for(var bomb in bombs){

					if(bombs.hasOwnProperty(bomb)){

						if(!bombs[bomb].safe()){

							allSafe = false;
							break;
						}
					}
				}

				return allSafe;		

			}


			function setVisible(){

				visible = true;
			}


			function setInvisible(){

				visible = false;
			}


			function isVisible(){

				return visible;
			}

			function getSecondsRemaining()
			{
				var secs = [];
				for(var bomb in bombs)
				{
					secs.push(bomb.getSecondsRemaining());
				}

				return secs;

			}


			// A bit involved, since bombs is not an array and thus
			// it doesn't have a length property.
			////////
			function randomize(){

				//bombs = Random.randArrayPermutation(bombs);
				var tempArray = [];
				for(var bomb in bombs){

					if(bombs.hasOwnProperty(bomb)){

						tempArray.push(bombs[bomb]);
					}
				}

				tempArray = Random.randArrayPermutation(tempArray);

				// Clear bombs object.
				bombs = {};

				for(var i = 0; i < tempArray.length; i++){

					bombs[i] = tempArray[i];
				}

			}



			return {

				getSecondsRemaining : getSecondsRemaining,
				isVisible : isVisible,
				initializeBombs : initializeBombs,
				update : update,
				render : render,
				reset : reset,
				on : on,
				checkClick : checkClick,
				allSafe : allSafe,
				setVisible : setVisible,
				setInvisible : setInvisible,
				randomize : randomize

			};

		}(_bombNotify, _levelParameters));




		ntts['RESULT'] = (function(){

			var _images = {loose : images['loose'], win : images['win']}
				, _width = 600
				, _height = 300
				, _center = {

					x : 600,
					y : 300
				}
				, _rotation = 0
				, spec
				, duration = 3
				, currentTime = 0
				, on = false
				, msgLoose = {}
				, msgWin = {}
				, currentSpec = {}
				, delay = 1
				, visible = true;

			msgLoose = Spec.create(_images.loose, _width, _height, _center, _rotation);
			msgWin = Spec.create(_images.win, _width, _height, _center, _rotation);



			function update(_elapsedTime){

				/*
				if(on && visible){
					currentTime += _elapsedTime;

					if(currentTime > duration){

						currentTime = 0;
						on = false;
					}
				}
				*/
			};



			function render(_graphics){

				if(on && visible){

					_graphics.drawImage(currentSpec);
				}
			};


			function setResult(_result){

				if(_result === 'win'){

					currentSpec = msgWin;
				}
				else if(_result === 'loose') {

					currentSpec = msgLoose;
				}
			}


			function initialize(){

				on = true;
				currentTime = 0;
				//delayDur = 0;
			}

			function isOn(){

				return on;
			}



			function setVisible(){

				visible = true;
			}


			function setInvisible(){

				visible = false;
			}

			function isVisible(){

				return visible;
			}


			return {

				isVisible : isVisible,
				initialize : initialize,
				render : render,
				setResult : setResult,
				update : update,
				on : isOn,
				setVisible : setVisible,
				setInvisible : setInvisible
			};


		}());




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
				, spec
				, visible = true;

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

				if(visible)
				{
					_graphics.drawImage(spec);
				}
			};


			function restart(){

				spec.width = specWidth;
				spec.height = specHeight;

				currentImage = 3;
				spec.image = _images[currentImage];

			};


			function setVisible(){

				visible = true;
			}


			function setInvisible(){

				visible = false;
			}

			function isVisible(){

				return visible;
			}

			return {

				isVisible : isVisible,
				setVisible : setVisible,
				setInvisible : setInvisible,
				update : update,
				render : render,
				restart : restart

			};

		}());


		
		ntts['EXP'] = (function(){

			function update(){}

			function render(){}

			function setExplosion(_location){}


			return {

				update : update,
				render : render,
				setExplosion : setExplosion
			}
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