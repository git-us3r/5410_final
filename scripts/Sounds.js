'use strict';

GAME.Sounds = (function(){


	function playSound (_sound) {

		//var tempSound = {};	
		//tempSound = _sounds['soundTypes'][_sound].cloneNode();
		//tempSound.play();

		switch(_sound){

			case 'hit':
			GAME.sounds['sounds/hit.wav'].cloneNode().play();
			break;

			case 'explosion':
			GAME.sounds['sounds/explosion.wav'].cloneNode().play();
			break;

			case 'gamePlay':
			GAME.sounds['sounds/gamePlay.wav'].cloneNode().play();
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
	};


}());