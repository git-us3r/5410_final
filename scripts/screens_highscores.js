/*jslint browser: true, white: true, plusplus: true */
/*global GAME */
GAME.screens['high-scores'] = (function() {
	'use strict';
	
	function initialize() {
		document.getElementById('id-high-scores-back').addEventListener(
			'click',
			function() { GAME.ScreenEngine.showScreen('main-menu'); },
			false);
	}
	
	
	function run(){

		// EMPTY
	}
	
	return {
		initialize : initialize,
		run : run
	};
}());
