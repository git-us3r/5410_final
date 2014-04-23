/*jslint browser: true, white: true */
// ------------------------------------------------------------------
// 
// This is the game module.  Everything about the game is located in 
// this object.
//
// ------------------------------------------------------------------


// ---------- NOTE ---------

// Local storage saves in like a JSON form; i.e., all elements are
// string representations. Hence, one can stringify the score objects
// and store them similarly. Sorting should not be more difficult,
// if an appropriate sortable key is chosen.
	
// -------------------------------

Storage = (function () {

		'use strict';
		//var sess = 0;
		

		// Sets the local storage to maintain top 5.
		function add(value) {
			//localStorage[performance.now()] = value;
			//sess++;
			var topScores = 5
				, pivot = -1
				, tempStorage = [];


			if(localStorage.length > 0){

				////////
				// First: populate temp array with the actual top scores (all greater than current)	
				// Second: insert current score in appropriate location
				// Third: continue populating temp array with the remaining top scores (at most 4)
				// Finally: clear localStorage and trasfer the ordered scores to it.
				//////////
				for(var i = 0; i < topScores; i++){


					// TODO : FIX
					if(localStorage[i] <= value || localStorage[i] === 'undefined'){

						pivot = i;
						break;
					}
				}


				for(var i = 0; i < pivot; i++){

					tempStorage.push(localStorage[i]);
				}

				tempStorage.push(value);

				for(var i = pivot; i < topScores - pivot; i++){

					tempStorage.push(localStorage[i]);
				}
			}
			else{

				tempStorage.push(value);
			}


			// Clear the storage to reset.
			localStorage.length = 0;

			for(var i = 0; i < topScores; i++){


				localStorage[i] = tempStorage[i];
			}
		}
		
		

		function remove(key) {
			localStorage.removeItem(key);
		}




		function report() {
			var node = document.getElementById('div-console'),
				item,
				key;
			
			node.innerHTML = 'Top 5 <br/> <ul>';
			/*
			for (item = 0; item < localStorage.length; item++) {
				key = localStorage.key(item);
				node.innerHTML += ('Session: ' + key + ' Score: ' + localStorage[key] + '<br/>');
			}
			*/
			var ctr = 1;
			for(var k in localStorage){
				if(localStorage.hasOwnProperty(k)){

					if(localStorage.getItem(k) === 'undefined'){

						key = 0;
					}
					else{

						key = JSON.parse(localStorage.getItem(k));

					}
					

					// New score
					node.innerHTML += ('<ul>' + ctr);
					for(var prop in key){

						if(key.hasOwnProperty(prop)){

							node.innerHTML += ('<li>' + prop + ': ' + key[prop] + '</li><br/>');
						}
					}

					node.innerHTML += ('</ul>');
					ctr++;

					if(ctr > 5){

						break;
					}
				}
			}
			node.innerHTML += '</ul>';
			node.scrollTop = node.scrollHeight;
		}

		return {
			add : add,
			remove : remove,
			report : report
		};
}())

/*
function addValue() {
	'use strict';
	
	MYGAME.persistence.add(
		document.getElementById('id-key').value,
		document.getElementById('id-value').value);

	MYGAME.persistence.report();
}

function removeValue() {
	'use strict';
	
	MYGAME.persistence.remove(document.getElementById('id-key').value);
	MYGAME.persistence.report();
}
*/
