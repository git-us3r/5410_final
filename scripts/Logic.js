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
		, resultsScreen = false
		, Score = {}
		, gameover = false
		, gameoverCtr = 0
		, gameoverTimeout = 3.9
		, hk = 0
		, expLocations = [

			{x : 100, y : 100},
			{x : 800, y : 300},
			{x : 500, y : 200},
			{x : 400, y : 400}
		];


	/////
	//
	// _NTTS is an object consisting of all the entities of the game:
	// bomb, score, etc.
	//
	///////

	function initialize (_NTTS, _score){

		NTTS = _NTTS;
		Score = _score;
		on = true;
		lastTimeStamp = 0;
		elapsedTime = 0;
		interlude = true;
		interludeDur = 4;
		interludeCurrent = 0;
		initialDelay = 1;
		delayOver = 3;
		delayCtr = 0;
		screenSwitch = false;
		firstRun = true;
		resultsScreen = false;
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
		//NTTS['BOMBS'].reset(GAME.gameState.bombTimers[GAME.gameState.currentLevel]);
		NTTS['BOMBS'].reset(GAME.gameState.bombTimers());
	}



	// This is just the get ready annimation sequence.
	function updateInterlude(elapsedTime){

		interludeCurrent += elapsedTime;

		// This allows the player to view the current screen for a moment longer after the level is over
		// If it is the first run, this is skipped, because is not a level up.
		if(interludeCurrent >= 0.1 && !screenSwitch && !firstRun){

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
			//GAME.gameState.randomizeTimers();
			//NTTS['BOMBS'].initializeBombs(GAME.Logic.bombNotification, GAME.gameState.bombTimers());
			NTTS['BACKGROUND'].ShutDown();
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


	function updateGame(elapsedTime){

		for(var ntt in NTTS){
			if(ntt !== 'NUMBERS' && NTTS[ntt] && NTTS[ntt].update){

				NTTS[ntt].update(elapsedTime);
			}
		}
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


	function updateGameOver(elapsedTime){


		gameoverCtr += elapsedTime;

		GAME.Sounds.lowerVol('gamePlay');

		if(gameoverCtr >= hk){

			NTTS['EXP'].setExplosion(expLocations[hk], GAME.Graphics);
			GAME.Sounds.playSound('explosion');
			hk++;
		}


		NTTS['GAMEOVER'].update(elapsedTime);
		NTTS['EXP'].update(elapsedTime);

		if(gameoverCtr > gameoverTimeout){

			on = false;
			GAME.Sounds.stopSound('gamePlay');
			ScreenEngine.showScreen('main-menu', GAME['screens']);

		}
	}



	function gameOverInterlude(){

		// on = false;
		// ScreenEngine.showScreen('main-menu', GAME['screens']);
		
		//NTTS.shutDown();
		// for now

		gameover = true;
		gameoverCtr = 0;
		NTTS['GAMEOVER'].run();



	}



	function checkLevelResults(){

		if(NTTS['BOMBS'].allSafe()){

			/// Check scores, and time here.
			// TODO:

			//GAME.gameState.currentLevel++;
			//winInterlude();


			var tempState = GAME.gameState.levelUp();
			Score.setLevelScores();
			if(tempState === -1){

				// Game over:
				// TODO: set the scores
				Storage.add(Score.reportScore());
				gameOverInterlude();
			}
			else{

				winInterlude();
			}

		}
		else{

			looseInterlude();
		}
	}


	function go2Interlude(){

		GAME.Input.collecting = false;		// wow ... no privacy!

		interludeCurrent = 0;
		interlude = true;

		NTTS['NUMBERS'].restart();
		screenSwitch = false;
	}



	function update (elapsedTime){

		GAME.Input.update(elapsedTime);
		Score.update(elapsedTime);

		if(interlude){

			updateInterlude(elapsedTime);
		}
		else if(resultsScreen){

			updateResults(elapsedTime);
		}
		else if (gameover){

			updateGameOver(elapsedTime);
		}
		else{

			updateGame(elapsedTime);

			if (levelOver()){

				delayCtr = 0;
				checkLevelResults();
			}
		}
	}
	


	function renderGameOver(_graphics){

		NTTS['GAMEOVER'].render(_graphics);
		NTTS['EXP'].render(_graphics);
	}



	function render(_graphics){

		if(interlude){

			
			for(var ntt in NTTS){

				if(NTTS[ntt] && NTTS[ntt].render){

					NTTS[ntt].render(_graphics);
				}
			}
		}
		else if (gameover){

				renderGameOver(_graphics);
		}
		else {

			for(var ntt in NTTS){

				if(ntt !== 'NUMBERS' && NTTS[ntt] && NTTS[ntt].render){

					NTTS[ntt].render(_graphics);
				}
			}	
		}

		Score.render(_graphics);

	}


	


	function run(_ntts, _score){

		initialize(_ntts, _score);

		//GAME.Input.startCollecting();

		elapsedTime = 0;
		lastTimeStamp = performance.now();

		GAME.Sounds.playSound('gamePlay');

		requestAnimationFrame(loop);
	};



	function levelOver(){

		//return NTTS['BOMBS'].on();
		return (NTTS['BOMBS'].done() && NTTS['EXP'].done());
	};


	function bombNotification(_status, _timeRemaining, _location){

		Score.processAction(_status, _timeRemaining);

		if(_status === 'exp'){

			NTTS['EXP'].setExplosion(_location, GAME.Graphics);
			GAME.Sounds.playSound('explosion');
		}
		else if (_status === 'safe'){
			GAME.Sounds.playSound('hit');
		}			

	};


	return {

		initialize : initialize,
		loop : loop,
		update : update,
		render : render,
		run : run,
		levelOver : levelOver,
		bombNotification : bombNotification
	};

}());


GAME.Score = (function(){

	var score = {

		TotalScore : 0,
		LevelScores : [],
		TotalTime : 0,
		LevelTimes : [],
	}
		, LevelScore = 0
		, LevelTime = 0
		, mult = 2
		, explosionPenalty = 5
		, center = {x : 800, y : 100};

	function processAction(_status, _timeRemaining){

		if(_status === 'safe')
		{
			// score += Math.max(_timeRemaining * mult, mult);
			LevelScore += Math.max(_timeRemaining * mult, 1);
			LevelTime += _timeRemaining;

		}
		else if (_status === 'exp')
		{
			LevelScore = Math.max(LevelScore - explosionPenalty, 0);
		}

	}


	//http://stackoverflow.com/questions/8779249/how-to-stringify-inherited-objects-to-json
	function flatten(obj) {
   
	    var result = Object.create(obj);
	    for(var key in result) {
	        result[key] = result[key];
	    }
	    return result;
	}


	function reportScore(){


		//setLevelScores();		
		return  JSON.stringify(flatten(score));
	};


	function setLevelScores(_levelTime){

		score.TotalScore += LevelScore;
		score.LevelScores.push(LevelScore);

		score.TotalTime += LevelTime;
		score.LevelTimes.push(LevelTime);
	}

	function resetScore(){

		score.TotalScore = 0;
		score.LevelScores = [];
		score.TotalTime = 0;
		score.LevelTimes = [];
		LevelScore = 0;
		LevelTime = 0;

	}

	function update(){

		// EMPTY
	}


	function render(_graphics){

		var ctx = _graphics.getContext();
		ctx.save();

		ctx.translate(center.x, center.y);
		

		ctx.font = '60px Arial';
		ctx.fillText('SCORE ' + LevelScore, 0, 0);	

		ctx.translate(-center.x, -center.y);			
		
		ctx.restore();
	}


	return {

		update : update,
		render : render,
		processAction : processAction,
		reportScore : reportScore,
		resetScore : resetScore,
		setLevelScores : setLevelScores

	};

}());




GAME.run = function(){

	GAME.Sounds.initialize();
	GAME.Score.resetScore();
	GAME.gameState.reset();
	GAME.gameState.randomizeTimers();
	//var _NTTS = GAME.NTTS.initialize(GAME.Score.bombNotification, GAME.gameState.bombTimers[GAME.gameState.currentLevel]);
	var _NTTS = GAME.NTTS.initialize(GAME.Logic.bombNotification, GAME.gameState.bombTimers());
	GAME.Input = Input;
	GAME.Input.bind2Window();
	GAME.Input.registerCommand(_NTTS['BOMBS'].checkClick);
	GAME.Logic.run(_NTTS, GAME.Score);
};