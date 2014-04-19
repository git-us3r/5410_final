'use strict';

// Depends on GAME.Graphics, GAME.NTTS, GAME.Input, (INCOMPLETE LIST!)

// Consider replacing GAME.* references by parameters.
/////

GAME.Logic = (function(){

	var that = {};
	that.on = false;
	that.interlude = false;
	that.interludeDur = 4;
	that.interludeCurrent = 0;
	that.NTTS = {};
	that.screenSwitch = false;
	that.firstRun = true;


	/////
	//
	// _NTTS is an object consisting of all the entities of the game:
	// bomb, score, etc.
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

		if(that.interlude){

			that.interludeCurrent += elapsedTime;

			if(that.interludeCurrent >= 1 && !that.screenSwitch && !that.firstRun){

				GAME.gameState.currentLevel++;
				//that.NTTS = GAME.NTTS.initialize(GAME.gameState.bombTimers[GAME.gameState.currentLevel]);
				that.NTTS['BOMBS'].reset(GAME.gameState.bombTimers[GAME.gameState.currentLevel]);
				that.screenSwitch = true;
			}
			if(that.interludeCurrent >= that.interludeDur){

				// Necessary evil.
				if(that.firstRun){

					that.firstRun = false;
				}


				that.NTTS['NUMBERS'].restart();
				that.interlude = false;
				that.screenSwitch = false;
				GAME.Input.collecting = true;
			}
			else{

				that.NTTS['NUMBERS'].update(elapsedTime);
			}

		}


		if(!that.interlude){

			for(var ntt in that.NTTS){

				if(ntt !== 'NUMBERS' && that.NTTS[ntt] && that.NTTS[ntt].update){

					that.NTTS[ntt].update(elapsedTime);
				}
			}
		}




		if (that.levelOver() && !that.interlude){
			// TODO: implement the waiting period between levels
			// all graphics need to be displayed and hold for a few seconds

			GAME.Input.collecting = false;		// wow ... no privacy!


			that.interludeCurrent = 0;
			that.interlude  = true;

			that.NTTS['NUMBERS'].restart();
			that.screenSwitch = false;
						
		}

		//that.Input.update(elapsedTime);
	};
	


	that.render = function(_graphics){

		if(that.interlude){

			for(var ntt in that.NTTS){

				if(that.NTTS[ntt] && that.NTTS[ntt].render){

					that.NTTS[ntt].render(_graphics);
				}
			}
		}
		else {

			for(var ntt in that.NTTS){

				if(ntt !== 'NUMBERS' && that.NTTS[ntt] && that.NTTS[ntt].render){

					that.NTTS[ntt].render(_graphics);
				}
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
		that.interlude = true;
		that.initialize(ntts);

		//GAME.Input.startCollecting();

		that.elapsedTime = 0;
		that.lastTimeStamp = performance.now();

		//that.PlaySound(that.Sounds.gamePlay)

		requestAnimationFrame(that.loop);
	};



	that.levelOver = function(){

		return that.NTTS['BOMBS'].on();
	};


	return that;
}());




GAME.run = function(){

	GAME.gameState.randomizeTimers();
	var _NTTS = GAME.NTTS.initialize(GAME.gameState.bombTimers[GAME.gameState.currentLevel]);
	GAME.Input = Input;
	GAME.Input.bind2Window();
	GAME.Input.registerCommand(_NTTS['BOMBS'].checkClick);
	GAME.Logic.run(_NTTS);
};