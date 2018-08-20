var fc = ["jon", "tom", "s hasse", "jesse", "aaron", "david", "wilson", "charlie", "aj", "will", "clyde", "manoj", "john k", "phil", "peter"];

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

shuffle(fc);
var random_fc = fc.join(",");
console.log(random_fc);
