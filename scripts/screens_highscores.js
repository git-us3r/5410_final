/*jslint browser: true, white: true, plusplus: true */
/*global GAME */
GAME.screens['high-scores'] = (function() {
	'use strict';
	
	function initialize() {
		document.getElementById('id-high-scores-back').addEventListener(
			'click',
			function() { ScreenEngine.showScreen('main-menu', GAME['screens']); },
			false);
	}
	
	
	function run(){

		Storage.report();
	}
	
	return {
		initialize : initialize,
		run : run
	};
}());
