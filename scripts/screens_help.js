/*jslint browser: true, white: true, plusplus: true */
/*global GAME */
GAME.screens['help'] = (function() {
	'use strict';
	
	function initialize() {
		document.getElementById('id-help-back').addEventListener(
			'click',
			function() { ScreenEngine.showScreen('main-menu', GAME['screens']);},
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
