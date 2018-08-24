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

function onInstallation(bot, installer) {
    if (installer) {
        bot.startPrivateConversation({user: installer}, function (err, convo) {
            if (err) {
                console.log(err);
            } else {
                convo.say('I am a bot that has just joined your team');
                convo.say('You must now /invite me to a channel so that I can be of use!');
            }
        });
    }
}

/**
 * Configure the persistence options
 */

var config = {};
if (process.env.MONGOLAB_URI) {
    var BotkitStorage = require('botkit-storage-mongo');
    config = {
        storage: BotkitStorage({mongoUri: process.env.MONGOLAB_URI}),
    };
} else {
    config = {
        json_file_store: ((process.env.TOKEN)?'./db_slack_bot_ci/':'./db_slack_bot_a/'), //use a different name if an app or CI
    };
}

/**
 * Are being run as an app or a custom integration? The initialization will differ, depending
 */

if (process.env.TOKEN || process.env.SLACK_TOKEN) {
    //Treat this as a custom integration
    var customIntegration = require('./lib/custom_integrations');
    var token = (process.env.TOKEN) ? process.env.TOKEN : process.env.SLACK_TOKEN;
    var controller = customIntegration.configure(token, config, onInstallation);
} else if (process.env.CLIENT_ID && process.env.CLIENT_SECRET && process.env.PORT) {
   console.log(process.env.CLIENT_ID);
    //Treat this as an app
    var app = require('./lib/apps');
    var controller = app.configure(process.env.PORT, process.env.CLIENT_ID, process.env.CLIENT_SECRET, config, onInstallation);
} else {
    console.log('Error: If this is a custom integration, please specify TOKEN in the environment. If this is an app, please specify CLIENTID, CLIENTSECRET, and PORT in the environment');
    process.exit(1);
}


/**
 * A demonstration for how to handle websocket events. In this case, just log when we have and have not
 * been disconnected from the websocket. In the future, it would be super awesome to be able to specify
 * a reconnect policy, and do reconnections automatically. In the meantime, we aren't going to attempt reconnects,
 * WHICH IS A B0RKED WAY TO HANDLE BEING DISCONNECTED. So we need to fix this.
 *
 * TODO: fixed b0rked reconnect behavior
 */
// Handle events related to the websocket connection to Slack
controller.on('rtm_open', function (bot) {
    console.log('** The RTM api just connected!');
});

controller.on('rtm_close', function (bot) {
    console.log('** The RTM api just closed');
    // you may want to attempt to re-open
});


/**
 * Core bot logic goes here!
 */
// BEGIN EDITING HERE!

controller.on('bot_channel_join', function (bot, message) {
    bot.reply(message, "I'm here!")
});

controller.hears('hello', 'direct_message', function (bot, message) {
    bot.reply(message, 'Hello!');
});

controller.hears("weekend", 'ambient', function(bot, message) {
    bot.reply(message, "WEEKEND!!!! YEAH!!! :taco: and :beer:");
});

controller.hears("monday", 'ambient', function(bot, message) {
    bot.reply(message, "Mondays are horrible, so have some more :Coffee:!");
});


controller.hears("tuesday", 'ambient', function(bot, message) {
    bot.reply(message, ":taco::taco::taco::taco::taco::taco::taco::taco::taco:");
});

controller.hears("Vacation", 'ambient', function(bot, message) {
    bot.reply(message, "Just make sure you come back.");
});

controller.hears("Flexion", 'ambient', function(bot, message) {
    bot.reply(message, "Flexion, Value Forward!");
});

controller.hears(
	    ['hello', 'hi', 'greetings'],
	    ['direct_mention', 'mention', 'direct_message'],
	        function(bot,message) {
		        bot.reply(message,'Hello!');
			    }
);


controller.hears(["standup_list"], ['ambient'], function(bot, message) {
	list = standup_list();
	console.log(list);
	bot.reply(message, list);
});

controller.hears(
	    ['tableflip'], ['ambient'], 
	        function(bot, message) {
			bot.reply(message, "http://tableflipper.com/IRX2.gif'");
});

controller.hears(
	    ['awesome'], ['ambient'], 
	        function(bot, message) {
			bot.reply(message, "Team Awesome Sauce, brought to you by :coffee: and :beer:");
});


controller.hears(
	    ['free bird', "freebird"], ['ambient'], 
	        function(bot, message) {
			bot.reply(message, "AND THIS :bird: YOU CANNOT CHANGE!!!! ");
});


controller.hears(
	    ['wisconsin'], ['ambient'],
	        function(bot, message) {
			bot.createConversation(message, function(err, convo) {
			    // create a path for when a user says YES
			    convo.addMessage({
			        text: 'You said yes! How wonderful.',
				},'yes_thread');
				
				// create a path for when a user says NO
				convo.addMessage({
				      text: 'You said no, that is too bad.',
				},'no_thread');
			
			        // create a path where neither option was matched
				// this message has an action field, which directs botkit to go back to the `default` thread after sending this message.
				    convo.addMessage({
				          text: 'Sorry I did not understand.',
				          action: 'default',
				          },'bad_response');

				// Create a yes/no question in the default thread...
				convo.addQuestion('Do you like cheese?', [
				     {
				       pattern: 'yes',
				       callback: function(response, convo) {
				convo.gotoThread('yes_thread');
				     },
				     },
				      {
				            pattern: 'no',
				   callback: function(response, convo) {
				convo.gotoThread('no_thread');
				     },
				      },
				 {
				         default: true,
				 callback: function(response, convo) {
				       convo.gotoThread('bad_response');
				         },
				       }
				 ],{},'default');

                                     convo.activate();
                             });
                     });








/**
 * AN example of what could be:
 * Any un-handled direct mention gets a reaction and a pat response!
 */
controller.on('direct_message,mention,direct_mention', function (bot, message) {
    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    }, function (err) {
        if (err) {
            console.log(err)
        }
        bot.reply(message, 'I heard you loud and clear boss.');
    });
});

controller.middleware.receive.use(function(bot, message, next) {
     console.log('RECEIVED: ', message);
     message.logged = true;
     next();
});
controller.middleware.send.use(function(bot, message, next) {
     console.log('SENT: ', message);
     message.logged = true;
     next();
});






