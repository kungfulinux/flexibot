
function shuffle(array) {
	  var currentIndex = array.length, temporaryValue, randomIndex;

	  while (0 !== currentIndex) {
              randomIndex = Math.floor(Math.random() * currentIndex);
              currentIndex -= 1;
              temporaryValue = array[currentIndex];
              array[currentIndex] = array[randomIndex];
              array[randomIndex] = temporaryValue;
          }

          return array;
}


function standup_list() {
	var arr = ['phil', 's hasse', 'charlie', 'jon', 'aaron', 'tom', 'wilson', 'aj', 'john k', 'jesse', 'manoj', 'clyde', 'will', 'david', 'peter'];
	arr = shuffle(arr);
	console.log(arr.join(","));
	return arr.join(",");
}


standup_list();

