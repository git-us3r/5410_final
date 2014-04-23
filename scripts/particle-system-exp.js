/*jslint browser: true, white: true, plusplus: true */
/*global Random */
//////
// INTERFACE
//
// spec exposes the following properties:
//	image
//	center
//	speed_mean
//	speed_std
// 	lifetime_mean
//	lifetime_std

// graphics exposes the method drawImage(spec)
//
///////////



function particleSystem(spec, graphics) {
	'use strict';
	var that = {},
		nextName = 1,	// unique identifier for the next particle
		particles = {};	// Set of all active particles

	//------------------------------------------------------------------
	//
	// This creates one new particle ... and pushes it onto particles.
	//
	//------------------------------------------------------------------
	that.create = function() {
		var p = {
				image: spec.image,
				size: Random.nextGaussian(10, 4),
				center: {x: spec.center.x, y: spec.center.y},
				velocity: Random.nextCircleVector(),
				acceleration : {x : 0, y : 0},
				width: spec.width,
				height: spec.height,
				initialWidth : spec.width,
				initialHeight : spec.height,
				speed: Random.nextGaussian(spec.speed_mean, spec.speed_std), // pixels per second
				rotation: 0,
				lifetime: spec.lifetime_mean, //Random.nextGaussian(spec.lifetime_mean, spec.lifetime_stdev),	// How long the particle should live, in seconds
				alive: 0	// How long the particle has been alive, in seconds
			};
		
		p.acceleration = p.velocity;

		//
		// Ensure we have a valid size - gaussian numbers can be negative
		p.size = Math.max(1, p.size);
		//
		// Same thing with lifetime
		p.lifetime = Math.max(0.01, p.lifetime);



		p.fall = function(elapsedTime){

			var gravityIsAB = { x : 0, y : 0.5 };

			p.acceleration = Vector2d.add(p.acceleration, gravityIsAB);

			p.velocity = Vector2d.add(p.acceleration, p.velocity);
			p.center = Vector2d.add(p.center, Vector2d.scale(p.speed, p.velocity));

		};



		//
		// Assign a unique name to each particle
		particles[nextName++] = p;

	};





	
	//------------------------------------------------------------------
	//
	// Update the state of all particles.  This includes remove any that 
	// have exceeded their lifetime.
	//
	//------------------------------------------------------------------
	that.update = function(elapsedTime) {
		var removeMe = [],
			value,
			particle,
			rotationRate = 0;

		
		for (value in particles) {
			if (particles.hasOwnProperty(value)) {
				particle = particles[value];
				//
				// Update how long it has been alive
				particle.alive += elapsedTime;
				
				//
			    // Update its position ---- (d * x, d * y) = d * (x,y) .. a scaled vector
			    // where (x,y) represents the particle's direction vector. Hence, this function
			    // scales the direction vector by the distance traveled ( time * speed ) and adds
			    // the result to the postition vector.
                //
                particle.fall(elapsedTime);
				// particle.center.x += (elapsedTime * particle.speed * particle.direction.x);
				// particle.center.y += (elapsedTime * particle.speed * particle.direction.y);
				



				
				//
				// Rotate proportional to its speed
				particle.rotation += rotationRate;


				// Reduce size of particle
				// particle.width = Math.max(0, particle.width * particle.lifetime);
				// particle.height = Math.max(0, particle.height * particle.lifetime);
				particle.width = Math.max(particle.width - elapsedTime * particle.initialWidth, 0);
				particle.height = Math.max(particle.height - elapsedTime * particle.initialHeight, 0);

				
				//
				// If the lifetime has expired, identify it for removal
				if (particle.alive > particle.lifetime) {
					removeMe.push(value);
				}
			}
		}

		//
		// Remove all of the expired particles
		for (particle = 0; particle < removeMe.length; particle++) {
			delete particles[removeMe[particle]];
		}
		removeMe.length = 0;
	};
	
	//------------------------------------------------------------------
	//
	// Render all particles
	//
	//------------------------------------------------------------------
	that.render = function() {
		var value,
			particle;
		
		for (value in particles) {
			if (particles.hasOwnProperty(value)) {
				particle = particles[value];
				graphics.drawImage(particle);
				
			}
		}
	};
	
	return that;
}
