///////
//
// _levelParameters is an array of numbers
// the length represents the number of bombs for the level
// the values represent the countdown start number for each bomb.
//
////////////
GAME.initializeNTTS = function(_levelParameters){

	var ntts = {};

	ntts['BK'] = GAME['images']['images/Background.png'];
	ntts['BombImage'] = GAME['images']['images/Bomb.png'];
	ntts['checkMark'] = GAME['images']['images/checkmark.png'];
	ntts['expMark'] = GAME['images']['images/Explosion.png'];

	ntts['GlassNumbers'] = [];


	// Side effect: ntts['GlassNumbers'] will contain the glasse numbers ordered in increasing number.
	for (var i = 0; i < 10; i++){

		ntts['GlassNumbers'].push(GAME['images']['images/glass_numbers_' + i + '.png']);
	}



	///////
	// BACKGROUND ... lol
	ntts['BACKGROUND'] = (function(){

		// Background NTT
		var ntt = {}
			, _image = ntts['BK']
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


		for(var i = 0; i < _levelTimers.length; i++){

			var glassImages = [];
			for (var countDown = _levelTimers[i]; countDown >= 0; countDown--) {

				glassImages.push(ntts['GlassNumbers'][countDown]);
			}

			var tempBomb = Bomb.create(ntts['BombImage']
										, glassImages
										, ntts['checkMark']
										, ntts['expMark']
										, bombDimension
										, bombDimension
										, positions[i]
										, 0
										, -1
										, true);

			ntt.bombs[tempBomb.id] = tempBomb;
		}



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


		ntt.checkClick = function(_clickLocation) {
			
			for(var bomb in ntt.bombs){
				if(ntt.bombs.hasOwnProperty(bomb)){

					if(ntt.bombs[bomb].on){

						if(ntt.bombs[bomb].hit(_clickLocation)){

							ntt.bombs[bomb].safe = true;
						}
					}
				}
			}
		}


		return ntt;

	}(_levelParameters));

	

	// Register Input object and register click function.
	ntts['INPUT'] = Input;
	ntts['INPUT'].registerCommand(ntts['BOMBS'].checkClick);

	return ntts;
};