

GAME.gameState = (function(){

	'use strict';

	var state = {}
		, maxLevel = 5
		, currentLevel = 1
		, gameOver = -1;

	//state.bombTimers = { ...
	var bombTimers = {	

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


	//state.maxLevel = 5;
	//state.currentLevel = 1;

	state.levelUp = function(){

		if(currentLevel === maxLevel)
		{
			// game over
			return gameOver;
		}
		else if(currentLevel < maxLevel){

			// a little redundance never hurts ...
			currentLevel++;
			return currentLevel;

		}


	}


	state.bombTimers = function(){

		return bombTimers[currentLevel];
	}

	return state;

}());