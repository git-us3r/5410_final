'use strict';

GAME.gameState = (function(){

	var state = {};

	state.bombTimers = {

		1 : [3,3,2,2,1,1],
		2 : [4,3,2],
		3 : [5,4,3],
		4 : [6,5,4],
		5 : [7,6,5]
	};



	state.randomizeTimers = function (){

		for(var bombTimer in state.bombTimers){

			if(state.bombTimers.hasOwnProperty(bombTimer)){

				state.bombTimers[bombTimer] = Random.randArrayPermutation(state.bombTimers[bombTimer]);
			}
		}

	}


	state.maxLevel = 5;
	state.currentLevel = 1;

	return state;

}());




GAME.Logic = (function(){

	var that = {};
	that.on = false;
	that.NTTS = {};


	/////
	//
	// _NTTS is an objec consisting of all the entities of the game:
	// bomb, input, score, etc.
	//
	///////
	that.initialize = function (_NTTS, level){

		that.NTTS = _NTTS;

		that.canvas = document.getElementById('canvas');
		that.context = that.canvas.getContext('2d');

	
	
		(function initializeGraphics(){

			function _clear(){
		
			that.context.save();
			that.context.setTransform(1, 0, 0, 1, 0, 0);
			that.context.clearRect(0, 0, canvas.width, canvas.height);
			that.context.restore();
			}

			function _drawImage(spec) {
				
				that.context.save();
				
				that.context.translate(spec.center.x, spec.center.y);
				that.context.rotate(spec.rotation);
				that.context.translate(-spec.center.x, -spec.center.y);
				
				that.context.drawImage(
					spec.image, 
					spec.center.x - spec.width/2, 
					spec.center.y - spec.height/2,
					spec.width, spec.height);
				
				that.context.restore();
			}



			// Expose a graphics object to the particles.
			that.graphics = {

				clear : _clear,
				drawImage : _drawImage

			};

		}());



		//that.NTTS.InitializeNTTS();
		//Scores.Init();
	};
	


	that.loop = function(time){

		if(that.on)	{

			that.elapsedTime = time - that.lastTimeStamp;
			that.lastTimeStamp = time;

			// Time in seconds already.
			that.update(that.elapsedTime / 1000); 

			that.graphics.clear();
			that.render(that.graphics);

			requestAnimationFrame(that.loop);
		}
	};
	


	that.update = function (elapsedTime){

		for(var ntt in that.NTTS){

			if(that.NTTS[ntt] && that.NTTS[ntt].update){

				that.NTTS[ntt].update(elapsedTime);
			}
		}

		if (that.levelOver()){

			
						
		}

		//that.Input.update(elapsedTime);
	};
	


	that.render = function(_graphics){

		//that.graphics.drawImage(that.NTTS['METER']);
		//that.graphics.drawImage(that.NTTS['BAR']);
		for(var ntt in that.NTTS){

			if(that.NTTS[ntt] && that.NTTS[ntt].render){

				that.NTTS[ntt].render(_graphics);
			}
		}

	};



	that.playSound = function(_sound) {

		var tempSound = {};	
		tempSound = that.sounds[_sound + '.' + that.audioExt].cloneNode();
		tempSound.play();

	};


	


	that.run = function(ntts){

		that.on = true;

		that.initialize(ntts);
		that.NTTS['INPUT'].startCollecting();
		that.elapsedTime = 0;
		that.lastTimeStamp = performance.now();

		//that.PlaySound(that.Sounds.gamePlay)

		requestAnimationFrame(that.loop);
	};



	that.levelOver = function(){

		var over = true;

		// If at least one bomb is on, the leve goes on.
		for(var bomb in that.NTTS['BOMBS']['bombs']){

			if(that.NTTS['BOMBS']['bombs'].hasOwnProperty(bomb)){

				if(that.NTTS['BOMBS']['bombs'][bomb].on){

					over = false;
				}
			}
		}

		return over;
	};


	return that;
}());





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

	


	ntts['INPUT'] = Input;
	ntts['INPUT'].registerCommand(ntts['BOMBS'].checkClick);

	return ntts;
};





GAME.run = function(){

	GAME.gameState.randomizeTimers();
	var _NTTS = GAME.initializeNTTS(GAME.gameState.bombTimers[GAME.gameState.currentLevel]);
	GAME.Logic.run(_NTTS);
};