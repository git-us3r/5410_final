

GAME.Sounds = (function(){

	'use strict';
	var hit = {}
		, gamePlay = {}
		, explosion = {};
	
	function playSound (_sound) {

		//var tempSound = {};	
		//tempSound = _sounds['soundTypes'][_sound].cloneNode();
		//tempSound.play();

		switch(_sound){

			case 'hit':
			hit.pause();
			hit.currentTime = 0;
			hit.play();
			break;

			case 'explosion':
			explosion.pause();
			explosion.currentTime = 0;
			explosion.play();
			break;

			case 'gamePlay':
			gamePlay.pause();
			gamePlay.currentTime = 0;
			gamePlay.play();
			break;			

			default:
			break;
		}


	}



	function stopSound (_sound) {

		//var tempSound = {};	
		//tempSound = _sounds['soundTypes'][_sound].cloneNode();
		//tempSound.play();

		switch(_sound){

			case 'hit':
			hit.pause();
			hit.currentTime = 0;
			break;

			case 'explosion':
			explosion.pause();
			explosion.currentTime = 0;
			break;

			case 'gamePlay':
			gamePlay.pause();
			gamePlay.currentTime = 0;
			break;			

			default:
			break;
		}


	}


	function lowerVol(_sound){

		switch(_sound){

			case 'hit':
			hit.volume = 0.1 * GAME.sounds['sounds/hit.wav'].volume;
			break;

			case 'explosion':
			explosion.volume = 0.1 * GAME.sounds['sounds/explosion.wav'].volume;
			break;

			case 'gamePlay':
			gamePlay.volume = 0.5;
			break;			

			default:
			break;
		}

	}


	function initialize(){

		hit = GAME.sounds['sounds/hit.wav'];
		explosion = GAME.sounds['sounds/explosion.wav'];
		gamePlay = GAME.sounds['sounds/gamePlay.wav'];

		gamePlay.volume = 0.2;
	}



	return {

		playSound : playSound,
		stopSound : stopSound,
		lowerVol : lowerVol,
		initialize : initialize
	};


}());