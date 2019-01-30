var acronymicon = require("./acronymicon.json");
module.exports.default = function(bot, message) {
  var acr = message.text.split(" ").pop();
  var msg =
    acronymicon[acr] || "https://media.giphy.com/media/KOc9VDl9U06s0/giphy.gif";
  bot.reply(message, msg);
};
