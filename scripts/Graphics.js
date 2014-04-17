'use strict';


GAME.Graphics = (function(){

	var canvas = {}
		, context = {}
		, drawImage = {}
		, clear = {};

	function initialize(){

		canvas = document.getElementById('canvas');
		context = canvas.getContext('2d');

		function _clear(){

		context.save();
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.restore();
		}

		function _drawImage(spec) {
			
			that.context.save();
			
			context.translate(spec.center.x, spec.center.y);
			context.rotate(spec.rotation);
			context.translate(-spec.center.x, -spec.center.y);
			
			context.drawImage(
				spec.image, 
				spec.center.x - spec.width/2, 
				spec.center.y - spec.height/2,
				spec.width, spec.height);
			
			context.restore();
		}

		drawImage = _drawImage;
		clear = _clear;
	}



	// Expose a graphics object to the particles.
	return {

		initialize : initialize,
		canvasDim : {x : canvas.width, y : canvas.height},
		clear : clear,
		drawImage : drawImage

	};

}());