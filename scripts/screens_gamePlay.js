GAME.screens['game-play'] = (function(){

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