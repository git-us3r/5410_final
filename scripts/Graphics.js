'use strict';


GAME.Graphics = (function(){

	var canvas = {}
		, context = {}
		, canvasDim = {};


	function initialize(){

		canvas = document.getElementById('canvas');
		context = canvas.getContext('2d');
		canvasDim = {x: canvas.width, y : canvas.height};
	}

	function clear(){

		context.save();
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.restore();
	}

	function drawImage(spec) {
		
		context.save();
		
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


	function getCanvasDim() {

		return canvasDim;
	}



	// Expose a graphics object to the particles.
	return {

		getContext : function(){return context;},
		initialize : initialize,
		canvasDim : getCanvasDim,
		clear : clear,
		drawImage : drawImage

	};

}());