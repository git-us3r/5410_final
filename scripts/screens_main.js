/*jslint browser: true, white: true, plusplus: true */
/*global GAME */

GAME.screens['main-menu'] = (function() {
	'use strict';
	
	function initialize() {
		//
		// Setup each of menu events for the ScreenEngine
		document.getElementById('id-new-game').addEventListener(
			'click',
			function() { ScreenEngine.showScreen('game-play', GAME['screens'] ); },
			false);
		
		document.getElementById('id-high-scores').addEventListener(
			'click',
			function() { ScreenEngine.showScreen('high-scores', GAME['screens']); },
			false);
		
		document.getElementById('id-help').addEventListener(
			'click',
			function() { ScreenEngine.showScreen('help', GAME['screens']); },
			false);
		
		document.getElementById('id-about', GAME['screens']).addEventListener(
			'click',
			function() { ScreenEngine.showScreen('about', GAME['screens']); },
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
