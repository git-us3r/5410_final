// Explosion
// 
// Uses particle-system.js
/////

// An explosion consists of at least one particle system.
// Generally, several particle systems make up a single explosion effect.
/////
'use strict';

var Explosion = (function(){
	
	var that = {},
		uniqueId = 0;


	
	that.explosionParameters = function (_specs, _graphics, _duration){

		return {
			specs : _specs || [],
			graphics : _graphics || {},
			duration : _duration
		};
	};



	// Client Interface: depends on that.explosionParamters and particle-system.js
	that.create = function(explosionParameters){

		// TODO
		var explosion = {},
			visibility = true;


		(function init(){
			
			// explosion.particleSystems consists of an array of objects: {system : aSystem, visible: bool}
			explosion.particleSystems = [];

			explosion.duration = explosionParameters.duration;
			explosion.graphics = explosionParameters.graphics;

			explosion.lifetime = 0;
			explosion.visible = true;

			explosion.id = uniqueId;
			uniqueId++;



			// initialize the systems
			for (var i = 0; i < explosionParameters.specs.length; i++){

				// Set visibility for this system
				if (explosionParameters.specs[i].image !== null){

					// add a new system-visibility pair for each element of the explosion.
					explosion.particleSystems.push(

						// object: {particle-system, int}
						{
							system: particleSystem(
							
								explosionParameters.specs[i],
								explosionParameters.graphics
							),
							genRate : explosionParameters.specs[i].genRate
						}
					);
				}
			}


			// Prime the system.
			explosion.particleSystems.forEach(function(element, index, array){

				if ( element ){
					
					for (var i = 0; i < element.genRate; i++){

						element.system.create();
					}
				}
			});



		}());

		// Wrap the update function to work with several systems
		// particle-system does not recreate dead particles
		//////
		explosion.update = function(elapsedTime){

			// Update lifetime
			explosion.lifetime += elapsedTime;	

			// Update if the explosion is alive.
			if(explosion.visible && explosion.lifetime < explosion.duration){

				explosion.particleSystems.forEach(function(element, index, array){

						element.system.update(elapsedTime);

				});
			}			
			else if (explosion.visible){

				// This flag can be used to remove expired explosions (client)
				explosion.visible  = false;
			}
		};


		// Wrap the render function
		explosion.render = function(){

			explosion.particleSystems.forEach(function(element, index, array){

					element.system.render(explosion.graphics);
			});
		};


		return explosion;
	};

	return that;
}());