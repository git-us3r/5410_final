'use strict';



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

		/*
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
		*/
		//that.NTTS.InitializeNTTS();
		//Scores.Init();
	};
	


	that.loop = function(time){

		if(that.on)	{

			that.elapsedTime = time - that.lastTimeStamp;
			that.lastTimeStamp = time;

			// Time in seconds already.
			that.update(that.elapsedTime / 1000); 

			GAME.Graphics.clear();
			that.render(GAME.Graphics);

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




GAME.run = function(){

	GAME.gameState.randomizeTimers();
	var _NTTS = GAME.initializeNTTS(GAME.gameState.bombTimers[GAME.gameState.currentLevel]);
	GAME.Logic.run(_NTTS);
};