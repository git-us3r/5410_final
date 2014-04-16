/*jslint browser: true, white: true, plusplus: true */
/*global GAME */

GAME.screens['main-menu'] = (function() {
	'use strict';
	
	function initialize() {
		//
		// Setup each of menu events for the ScreenEngine
		document.getElementById('id-new-game').addEventListener(
			'click',
			function() { GAME.ScreenEngine.showScreen('game-play'); },
			false);
		
		document.getElementById('id-high-scores').addEventListener(
			'click',
			function() { GAME.ScreenEngine.showScreen('high-scores'); },
			false);
		
		document.getElementById('id-help').addEventListener(
			'click',
			function() { GAME.ScreenEngine.showScreen('help'); },
			false);
		
		document.getElementById('id-about').addEventListener(
			'click',
			function() { GAME.ScreenEngine.showScreen('about'); },
			false);
	}
	
	function run() {
		//
		// I know this is empty, there isn't anything to do.
	}
	
	return {
		initialize : initialize,
		run : run
	};
}());
