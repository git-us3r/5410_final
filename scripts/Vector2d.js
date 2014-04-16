// 2dVector
//
// This will be a small lib to provide functionality for 2d vectors.
// For flexibility, this has no members.
// 
// A vector is any object with the following interface: {x: number, y: number}

var Vector2d = (function(){
	
	var that = {};

	that.magnitude = function(v){

		var t = Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));
		if(t > .99991 && t < 1.00001) {

			return 1;		// ;)
		}
		else{

			return t;
		}
	};



	// The angle between this vector and the vector <1, 0>, which represents 2 * k * PI.
	that.angle = function(v){

		// use the dot product between v and <1,0>
		return that.angleBetween(v, {x:1, y:0});

	};



	// 0 <= angle <= PI
	that.vectorFromAngle = function(angle){

		var _x = Math.cos(angle),
			_y = Math.sin(angle);

		return {x: _x, y: _y};
	};



	that.scale = function(s, v){

		// Memberwise mult.
		return {x: s * v.x, y: s * v.y};
	};



	that.add = function(v1, v2){

		return {x: v1.x + v2.x, y: v1.y + v2.y};

	};




	// v1 - v2
	that.subtract = function(v1, v2){

		return {x: v1.x - v2.x, y: v1.y - v2.y};

	};



	// Returns a unit vector pointing in the same direction as this vector.
	that.getDirection = function(v){

		var _x, _y;

		_x = v.x / that.magnitude(v);
		_y = v.y / that.magnitude(v);

		return {x: _x, y: _y};


		// alternatively
		// return that.scale((1/that.magnitude(v)), v);

	};



	that.dotProduct = function(v1, v2){

		return (v1.x * v2.x) + (v1.y * v2.y);
	};



	// Returns the angle [ 0 <= theta <= PI ] between v1 and v2. 
	that.angleBetween = function(v1, v2){

		var dtp = that.dotProduct(v1, v2),
			mgV1 = that.magnitude(v1),
			mgV2 = that.magnitude(v2),
			cos = dtp / (mgV1 * mgV2);

		return Math.acos(cos);
	};


	// Returns a unit vector which is orthogonal to this vector.
	that.normalize = function(v){

		// tempV is orthogonal to v
		var tempV = {
			
			x: -(v.y / v.x),
			y: 1

		};

		// believe
		if ( that.dotProduct(v, tempV) === 0) {

			return that.getDirection(tempV);
		}
		else return null;
	};

	
	
	// Returns the distance distance between v1 and v2 (the magnitude of the difference).
	that.distance = function(v1, v2){
	
		//return Math.sqrt( Math.pow((v2.x - v1.x) , 2) + Math.pow((v2.y - v1.y), 2));
		return that.magnitude(that.subtract(v1, v2));
	};
	
	
	// Returns a vector which is midway between v1 and v2 (on a straight line path).
	that.midPoint = function (v1, v2){
		
		var temp = that.add(v1, v2);
		return that.scale(.5, temp);
		
	};
	



	// Returns the projection of this vector along v2 ()
	that.projection = function(v2){

		// TODO
	};



	// Returns the decomposition vector (see projection) which is orthogonal to v2.
	that.orthogonalComponent = function(v2){


		// TODO
	};

	return that;

}());
exports.Vector2d = Vector2d;