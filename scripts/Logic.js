'use strict';

// Depends on GAME.Graphics, GAME.NTTS, GAME.Input, (INCOMPLETE LIST!)

// Consider replacing GAME.* references by parameters.
/////

GAME.Logic = (function(){

	var	on = false
		, lastTimeStamp = 0
		, elapsedTime = 0
		, interlude = false
		, interludeDur = 4
		, interludeCurrent = 0
		, NTTS = {}
		, screenSwitch = false
		, firstRun = true;


	/////
	//
	// _NTTS is an object consisting of all the entities of the game:
	// bomb, score, etc.
	//
	///////

	function initialize (_NTTS, level){

		NTTS = _NTTS;

	}
	


	function loop(time){

		if(on)	{

			elapsedTime = time - lastTimeStamp;
			lastTimeStamp = time;

			// Time in seconds already.
			update(elapsedTime / 1000); 

			GAME.Graphics.clear();
			render(GAME.Graphics);

			requestAnimationFrame(loop);
		}
	}
	


	function update (elapsedTime){

		GAME.Input.update(elapsedTime);

		if(interlude){

			interludeCurrent += elapsedTime;

			if(interludeCurrent >= 1 && !screenSwitch && !firstRun){

				GAME.gameState.currentLevel++;
				//NTTS = GAME.NTTS.initialize(GAME.gameState.bombTimers[GAME.gameState.currentLevel]);
				NTTS['BOMBS'].reset(GAME.gameState.bombTimers[GAME.gameState.currentLevel]);
				screenSwitch = true;
			}
			if(interludeCurrent >= interludeDur){

				// Necessary evil.
				if(firstRun){

					firstRun = false;
				}


				NTTS['NUMBERS'].restart();
				interlude = false;
				screenSwitch = false;
				GAME.Input.collecting = true;
			}
			else{

				NTTS['NUMBERS'].update(elapsedTime);
			}

		}


		if(!interlude){

			for(var ntt in NTTS){

				if(ntt !== 'NUMBERS' && NTTS[ntt] && NTTS[ntt].update){

					NTTS[ntt].update(elapsedTime);
				}
			}
		}




		if (levelOver() && !interlude){
			// TODO: implement the waiting period between levels
			// all graphics need to be displayed and hold for a few seconds

			GAME.Input.collecting = false;		// wow ... no privacy!


			interludeCurrent = 0;
			interlude  = true;

			NTTS['NUMBERS'].restart();
			screenSwitch = false;
						
		}

		//Input.update(elapsedTime);
	}
	


	function render(_graphics){

		if(interlude){

			for(var ntt in NTTS){

				if(NTTS[ntt] && NTTS[ntt].render){

					NTTS[ntt].render(_graphics);
				}
			}
		}
		else {

			for(var ntt in NTTS){

				if(ntt !== 'NUMBERS' && NTTS[ntt] && NTTS[ntt].render){

					NTTS[ntt].render(_graphics);
				}
			}	
		}

	}


	


	function run(ntts){

		on = true;
		interlude = true;
		initialize(ntts);

		//GAME.Input.startCollecting();

		elapsedTime = 0;
		lastTimeStamp = performance.now();

		//PlaySound(Sounds.gamePlay)

		requestAnimationFrame(loop);
	};



	function levelOver(){

		return NTTS['BOMBS'].on();
	};


	return {

		initialize : initialize,
		loop : loop,
		update : update,
		render : render,
		run : run,
		levelOver : levelOver
	};

}());




GAME.run = function(){

	GAME.gameState.randomizeTimers();
	var _NTTS = GAME.NTTS.initialize(GAME.gameState.bombTimers[GAME.gameState.currentLevel]);
	GAME.Input = Input;
	GAME.Input.bind2Window();
	GAME.Input.registerCommand(_NTTS['BOMBS'].checkClick);
	GAME.Logic.run(_NTTS);
};