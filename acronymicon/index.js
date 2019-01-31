//var acronymicon = require("./acronymicon.json");
var fetch = require("node-fetch");
var summonAcronymicon = function() {
  var options = {
    sheet: "1le17uVrLisQeylN7fsA2QvvP-FjBI63MPgULOaSRqxU",
    key: "AIzaSyAN7P6J6xhT80OWrvSvFk1e1hZC8O_gzVM"
  };
  var url =
    "https://sheets.googleapis.com/v4/spreadsheets/" +
    options.sheet +
    "/values/Sheet1!A1:C999?key=" +
    options.key;
  return fetch(url)
    .then(response => response.json())
    .then(json => {
      var data = json.values ? json.values.slice(1) : [];
      const normalize = data.reduce((acc, cur) => {
        acc[cur[0]] = { title: cur[1], definition: cur[2] };
        return acc;
      }, {});
      return normalize;
    });
};

var runAcronymicon = function(bot, message) {
  summonAcronymicon().then(acronymicon => {
    var acr = message.text.split(" ").pop();
    var term = acronymicon[acr];
    var msg = term
      ? term.title + ": " + term.definition
      : "https://media.giphy.com/media/KOc9VDl9U06s0/giphy.gif";
    console.log(msg);
    //  bot.reply(message, msg);
  });
};

module.exports = {
  default: runAcronymicon,
  summon: summonAcronymicon
};
