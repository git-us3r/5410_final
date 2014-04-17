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

		GAME.Input.update(elapsedTime);

		for(var ntt in that.NTTS){

			if(that.NTTS[ntt] && that.NTTS[ntt].update){

				that.NTTS[ntt].update(elapsedTime);
			}
		}

		if (that.levelOver()){

			// TODO: implement the waiting period between levels
			// all graphics need to be displayed and hold for a few seconds.
			GAME.gameState.currentLevel++;
			that.NTTS = GAME.NTTS.initialize(GAME.gameState.bombTimers[GAME.gameState.currentLevel])
						
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

		GAME.Input.startCollecting();

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
					break;
				}
			}
		}

		return over;
	};


	return that;
}());




GAME.run = function(){

	GAME.gameState.randomizeTimers();
	var _NTTS = GAME.NTTS.initialize(GAME.gameState.bombTimers[GAME.gameState.currentLevel]);
	GAME.Input = Input;
	GAME.Input.registerCommand(GAME.NTTS.checkClick);
	GAME.Logic.run(_NTTS);
};