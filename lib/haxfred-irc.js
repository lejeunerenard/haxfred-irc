var irc = require('irc');

var haxfred_irc = function(haxfred) {
  var irc_client = new irc.Client(haxfred.config.server, haxfred.config.nicks[1], {
    channels: haxfred.config.channels
  });
  console.log('IRC successfully loaded');
};

haxfred_irc.prototype.isPersonal = function(message) {
  return bot.personalRegex.test(message);
};

module.exports = haxfred_irc;
