/*jslint browser: true, white: true */
/*global MYGAME */
// ------------------------------------------------------------------
//
//
//
// ------------------------------------------------------------------
Input = (function() {
	'use strict';
	
		var that = {
				mouseDownArr : [],				
				handlersDownArr : []				
		};

		that.collecting = false;

		that.mouseDown = function(e) {
			
			that.mouseDownArr.push(e);
		};
		
		
		that.update = function(elapsedTime) {
			
			if(that.collecting) {

				var event
				    , handler;

				//
				// Process the mouse events for each of the different kinds of handlers
				for (event = 0; event < that.mouseDownArr.length; event++) {
					for (handler = 0; handler < that.handlersDownArr.length; handler++) {
						that.handlersDownArr[handler](that.mouseDownArr[event], elapsedTime);
					}
				}
			}
			
			
			
			//
			// Now that we have processed all the inputs, reset everything back to the empty state
			that.mouseDownArr.length = 0;
			
		};


		
		that.registerCommand = function(handler) {
			
			that.handlersDownArr.push(handler);
			
		};

		
		that.bind2Window = function(){

			window.addEventListener('mousedown', that.mouseDown.bind(that));
			//that.collecting = true;
		};
		
		return that;
	}());
