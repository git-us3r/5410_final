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
		, initialDelay = 1
		, delayOver = 3
		, delayCtr = 0
		, NTTS = {}
		, screenSwitch = false
		, firstRun = true
		, resultsScreen = false;


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
	

	function setLevel (argument) {

		// TODO: determine if it should switch to a new level or repeat the old one.
		NTTS['BOMBS'].reset(GAME.gameState.bombTimers[GAME.gameState.currentLevel]);
	}



	// This is just the get ready annimation sequence.
	function updateInterlude(elapsedTime){

		interludeCurrent += elapsedTime;

		// This allows the player to view the current screen for a moment longer after the level is over
		// If it is the first run, this is skipped, because is not a level up.
		if(interludeCurrent >= 2 && !screenSwitch && !firstRun){

			setLevel();
			screenSwitch = true;
			NTTS['BOMBS'].setVisible();

		}
		if(interludeCurrent >= interludeDur){

			// Necessary evil.
			if(firstRun){

				firstRun = false;
			}

			delayCtr = 0;
			NTTS['BACKGROUND'].ResetBackground();
			NTTS['NUMBERS'].restart();
			interlude = false;
			screenSwitch = false;
			GAME.Input.collecting = true;
		}
		else{

			NTTS['NUMBERS'].update(elapsedTime);
			NTTS['BACKGROUND'].update(elapsedTime);
		}
	}



	function updateGame(elapsedTime){

		for(var ntt in NTTS){

			if(ntt !== 'NUMBERS' && NTTS[ntt] && NTTS[ntt].update){

				NTTS[ntt].update(elapsedTime);
			}
		}
	}



	function looseInterlude(){

		// TODO: implement
		resultsScreen = true;
		NTTS['RESULT'].setResult('loose');
		NTTS['RESULT'].initialize();
		NTTS['RESULT'].setInvisible();
		NTTS['BACKGROUND'].InterludeOn();


	}


	function winInterlude(){

		resultsScreen = true;
		NTTS['RESULT'].setResult('win');
		NTTS['RESULT'].initialize();
		NTTS['RESULT'].setInvisible();
		NTTS['BACKGROUND'].InterludeOn();

	}



	function updateResults (elapsedTime) {
		
		delayCtr += elapsedTime;

		NTTS['BACKGROUND'].update(elapsedTime);


		if(delayCtr >= initialDelay && !NTTS['RESULT'].isVisible()){

			NTTS['RESULT'].setVisible();
			NTTS['BOMBS'].setInvisible();
		}


		if(delayCtr >= delayOver){

			resultsScreen = false;
			NTTS['RESULT'].setInvisible();
			go2Interlude();

		}
	}



	function checkLevelResults(){

		if(NTTS['BOMBS'].allSafe()){

			GAME.gameState.currentLevel++;
			winInterlude();

		}
		else{

			looseInterlude();
		}


		

	}


	function go2Interlude(){

		GAME.Input.collecting = false;		// wow ... no privacy!

		interludeCurrent = 0;
		interlude  = true;

		NTTS['NUMBERS'].restart();
		screenSwitch = false;
	}



	function update (elapsedTime){

		GAME.Input.update(elapsedTime);

		if(interlude){

			updateInterlude(elapsedTime);
		}
		else if(resultsScreen){

			updateResults(elapsedTime);
		}
		else{

			updateGame(elapsedTime);

			if (levelOver()){

				delayCtr = 0;
				checkLevelResults();
			}
		}
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