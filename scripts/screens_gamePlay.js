GAME.screens['game-play'] = (function(){
	'use strict';
	
	function initialize() {
		/*
		document.getElementById('game-play-back').addEventListener(
			'click'
			, function() { 

				GAME.logic.gameOver();
				GAME.ScreenEngine.showScreen('main-menu'); 
			}
			, false);
		*/
	}
	
	function run() {

		GAME.run();
	}
	
	return {
		initialize : initialize,
		run : run
	};
}());