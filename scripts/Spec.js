/////////
//
// Base Class Spec
// 
// Represents a drawable element. It has location, size, and texture.
//
///////////

var Spec = (function(){

	'use strict';


	function create(_image, _width, _height, _center, _rotation){
	
		var spec = {};
		
		spec.image = _image;
		spec.width = _width;
		spec.height = _height;
		spec.center = _center;
		spec.rotation = _rotation;


		spec.update = function(elapsedTime, canvasDim){

			// Implement this, when extending this class.
		};


		return spec;
	};
	// END Spec.create


	return {create : create};
	
}());