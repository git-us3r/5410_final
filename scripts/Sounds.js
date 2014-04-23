

GAME.Sounds = (function(){

	'use strict';
	
	function playSound (_sound) {

		//var tempSound = {};	
		//tempSound = _sounds['soundTypes'][_sound].cloneNode();
		//tempSound.play();

		switch(_sound){

			case 'hit':
			GAME.sounds['sounds/hit.wav'].cloneNode().currentTime = 0;
			GAME.sounds['sounds/hit.wav'].cloneNode().play();
			break;

			case 'explosion':
			GAME.sounds['sounds/explosion.wav'].currentTime = 0;
			GAME.sounds['sounds/explosion.wav'].play();
			break;

			case 'gamePlay':
			GAME.sounds['sounds/gamePlay.wav'].currentTime = 0;
			GAME.sounds['sounds/gamePlay.wav'].play();
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
			GAME.sounds['sounds/hit.wav'].cloneNode().pause();
			GAME.sounds['sounds/hit.wav'].cloneNode().currentTime = 0;
			break;

			case 'explosion':
			GAME.sounds['sounds/explosion.wav'].pause();
			GAME.sounds['sounds/explosion.wav'].currentTime = 0;
			break;

			case 'gamePlay':
			GAME.sounds['sounds/gamePlay.wav'].pause();
			GAME.sounds['sounds/gamePlay.wav'].currentTime = 0;
			break;			

			default:
			break;
		}


	}



	return {

		PossibleSounds : {

			hit : 'hit',
			explosion : 'explosion',
			gamePlay : 'gamePlay'
		}
		, playSound : playSound
		, stopSound : stopSound
	};


}());