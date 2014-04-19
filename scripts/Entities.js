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


	// Side effect: ntts['GlassNumbers'] will contain the glasse numbers ordered in increasing number.
	for (var i = 0; i < 10; i++){

		images['GlassNumbers'].push(GAME['images']['images/glass_numbers_' + i + '.png']);
	}






	function initialize(_levelParameters){

		///////
		// BACKGROUND ... lol
		ntts['BACKGROUND'] = (function(){

			// Background NTT
			var ntt = {}
				, _image = images['BK']
				, _width = 1200
				, _height = 600
				, _center = {

					x : 600,
					y : 300
				}
				, _rotation = 0;

			ntt.spec = Spec.create(_image, _width, _height, _center, _rotation);

			ntt.render = function(_graphics){

				_graphics.drawImage(ntt.spec);
			};

			return ntt;
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

					{x : 400, y : 200}
					, {x : 600, y : 200}
					, {x : 800, y : 200}
					, {x : 400, y : 400}
					, {x : 600, y : 400}
					, {x : 800, y : 400}

				]
				, ntt = {};

			ntt.bombs = {};


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

					ntt.bombs[tempBomb.id] = tempBomb;
				}
			}

			// call it right now plz
			initializeBombs(_levelTimers);



			ntt.update = function(_elapsedTime){

				for (var bomb in ntt.bombs){
					if(ntt.bombs.hasOwnProperty(bomb)){

						ntt.bombs[bomb].update(_elapsedTime);
					}
				}
			};




			ntt.render = function(_graphics){

				for (var bomb in ntt.bombs){
					if(ntt.bombs.hasOwnProperty(bomb)){

						ntt.bombs[bomb].render(_graphics);
					}
				}
			};



			ntt.reset = function(_levelTimers){

				ntt.bombs = {};
				initializeBombs(_levelTimers);

			};


			return ntt;

		}(_levelParameters));



		ntts['NUMBERS'] = (function(){

			var ntt = {}
				, _images = {0 : images['GO'], 1 : images['number1'], 2 : images['number2'], 3 : images['number3']}
				, _width = 300
				, _height = 300
				, _center = {

					x : 600,
					y : 300
				}
				, _rotation = 0;

			ntt.currentImage = 3;
			ntt.specWidth = 300;
			ntt.specHeight = 300;

			ntt.spec = Spec.create(_images[3], _width, _height, _center, _rotation);

			ntt.update = function(_elapsedTime){

				ntt.spec.width -= _elapsedTime * ntt.specWidth;
				ntt.spec.height -= _elapsedTime * ntt.specHeight;

				if(ntt.spec.width <= 1 || ntt.spec.height <= 1){

					ntt.spec.width = 300;
					ntt.spec.height = 300;

					ntt.currentImage--;
					ntt.spec.image = _images[ntt.currentImage];
				}
			};


			ntt.render = function(_graphics){

				_graphics.drawImage(ntt.spec);
			};


			ntt.restart = function(){

				ntt.spec.width = ntt.specWidth;
				ntt.spec.height = ntt.specHeight;

				ntt.currentImage = 3;
				ntt.spec.image = _images[ntt.currentImage];

			};


			return ntt;

		}());



		// Register Input object and register click function.
		// ntts['INPUT'] = Input;
		// ntts['INPUT'].registerCommand(ntts['BOMBS'].checkClick);

		return ntts;
	}


	function checkClick(_clickLocation) {
				
		for(var bomb in ntts['BOMBS']['bombs']){
			if(ntts['BOMBS']['bombs'].hasOwnProperty(bomb)){

				if(ntts['BOMBS']['bombs'][bomb].on){

					/*
					if(ntts['BOMBS']['bombs'][bomb].hit(_clickLocation)){


						playsound(sounds.hit);
						ntts['BOMBS']['bombs'][bomb].safeRequest = true;
					}
					*/

					// CHANGE:
					// Use the new interface: call hit
					ntts['BOMBS']['bombs'][bomb].hit(_clickLocation);					
				}
			}
		}
	}

	// Expose the initialize method.
	return {

		initialize : initialize,
		checkClick : checkClick
	};

}());