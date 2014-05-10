var irc = require('irc');
var Haxfred;

var haxfred_irc = function(haxfred) {
  Haxfred = haxfred;
  Haxfred.irc = {};

  // Determine the nick
  Haxfred.irc._currentNick = Haxfred.config.nicks[1];
  Haxfred.irc.client = new irc.Client(Haxfred.config.server, Haxfred.irc._currentNick, {
    channels: Haxfred.config.channels
  });

  /* ----- Listeners ----- */
  Haxfred.irc.client.addListener('join', function (channel, nick) {
    if (nick != Haxfred.irc.client.nick) {
      Haxfred.irc.say("Welcome " + nick + "!");
    }
  });

  Haxfred.irc.client.addListener('message' + Haxfred.config.channels[0], function (from, message){
     if (isToHaxfred(message)) {
        haxfred.emit('irc.pm', {
           from: from,
           content: message,
           response: '',
           onComplete: function() {
             Haxfred.irc.say(this.response);
           }
        });
     } else {
        haxfred.emit('irc.message', {
           from: from,
           content: message,
           response: '',
           onComplete: function() {
             Haxfred.irc.say(this.response);
           }
        });
     }
  });

  /*
   * isToHaxfred
   * This function returns a boolean for whether Haxfred is being directly addressed in the message.
   */
  function isToHaxfred(message) {
    var personalRegex = new RegExp(Haxfred.irc.client.nick + '(:.*)');
    return personalRegex.test(message);
  };

  Haxfred.irc.say = function(message, channel) {
    channel = channel || Haxfred.config.channels[0];
    Haxfred.irc.client.say(channel, message);
  };

  /* ----- Haxfred Listeners ----- */
  haxfred.on('irc.pm', '', function(data, deferred) {
    haxfred.irc.say('thanks for thinking of me');
    deferred.resolve();
  });

  console.log('irc was loaded');
};

module.exports = haxfred_irc;
