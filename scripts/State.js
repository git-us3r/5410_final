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