var GAME = {
	images : {},
	screens : {},
	sounds : {},
	//logic : {},

	status : {
		preloadRequest : 0,
		preloadComplete : 0
	}
};




//------------------------------------------------------------------
//
// Wait until the browser 'onload' is called before starting to load
// any external resources.  This is needed because a lot of JS code
// will want to refer to the HTML document.
//
//------------------------------------------------------------------
window.addEventListener('load', function() {
	console.log('Loading resources...');

	GAME.audioExt = '';
	//
	// Find out which kind of audio support we have
	if (Modernizr.audio.mp3 === 'probably') {
		console.log('We have MP3 support');
		GAME.audioExt = 'mp3';
	}
	else if (Modernizr.audio.wav === 'probably') {
		console.log('We have WAV support');
		GAME.audioExt = 'wav';
	}

	Modernizr.load([
		{
			load : [
				'preload!images/Background.png',
				'preload!images/Bomb.png',
				'preload!images/checkmark.png',
				'preload!images/Explosion.png',
				'preload!images/glass_numbers_0.png',
				'preload!images/glass_numbers_1.png',
				'preload!images/glass_numbers_2.png',
				'preload!images/glass_numbers_3.png',
				'preload!images/glass_numbers_4.png',
				'preload!images/glass_numbers_5.png',
				'preload!images/glass_numbers_6.png',
				'preload!images/glass_numbers_7.png',
				'preload!images/glass_numbers_8.png',
				'preload!images/glass_numbers_9.png',
				'preload!images/number1.png',
				'preload!images/number2.png',
				'preload!images/number3.png',
				'preload!images/star_yellow.png',
				'preload!images/star_green.png',
				'preload!images/star_blue.png',
				'preload!images/star_purple.png',
				'preload!images/exp-center.png',
				'preload!images/GO.png',	
				'preload!images/win.png',
				'preload!images/loose.png',
				'preload!scripts/random.js',
				'preload!scripts/Vector2d.js',
				'preload!scripts/particle-system-exp.js',
				'preload!scripts/Spec.js',
				'preload!scripts/Bomb.js',
				'preload!scripts/Explosion.js',
				'preload!scripts/Sounds.js',
				'preload!scripts/Graphics.js',
				'preload!scripts/Input.js',
				'preload!scripts/State.js',
				'preload!scripts/Entities.js',
				'preload!scripts/Logic.js',
				'preload!scripts/screens_gamePlay.js',
				'preload!scripts/ScreenEngine.js',
				'preload!scripts/screens_main.js',				
				'preload!scripts/screens_highscores.js',
				'preload!scripts/screens_help.js',
				'preload!scripts/screens_about.js',
				'preload!sounds/gamePlay.' + GAME.audioExt,
				'preload!sounds/explosion.' + GAME.audioExt,
				'preload!sounds/hit.' + GAME.audioExt,
			],
			complete : function() {
				console.log('All files requested for loading...');
			}
		}
	]);
}, false);

//
// Extend yepnope with our own 'preload' prefix that...
// * Tracks how many have been requested to load
// * Tracks how many have been loaded
// * Places images into the 'images' object
yepnope.addPrefix('preload', function(resource) {
	console.log('preloading: ' + resource.url);
	
	GAME.status.preloadRequest += 1;

	// SOUNDS
	var isSound = /.+\.(mp3|wav)$/i.test(resource.url);
	//resource.noexecSound = isSound;
	// IMAGES
	var isImage = /.+\.(jpg|png|gif)$/i.test(resource.url);

	resource.noexecImage = isImage || isSound;
	
	resource.autoCallback = function(e) {
		if (isImage) {
			var image = new Image();
			image.src = resource.url;
			GAME.images[resource.url] = image;
		}
		else if (isSound) {
			var sound = new Audio(resource.url);
			console.log(resource.url);
			GAME.sounds[resource.url] = sound;
		}


		
		GAME.status.preloadComplete += 1;
		//console.log(GAME.status);
		
		//
		// When everything has finished preloading, go ahead and start the GAME
		if (GAME.status.preloadComplete === GAME.status.preloadRequest) {
			console.log('Preloading complete!');
			GAME.Graphics.initialize();
			ScreenEngine.initialize(GAME['screens']);
		}
	};
	
	return resource;
});




//
// Extend yepnope with a 'preload-noexec' prefix that loads a script, but does not execute it.  This
// is expected to only be used for loading .js files.
yepnope.addPrefix('preload-noexec', function(resource) {
	console.log('preloading-noexec: ' + resource.url);
	resource.noexec = true;
	return resource;
});
