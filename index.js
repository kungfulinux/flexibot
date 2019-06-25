var acronymicon = require("./acronymicon").default;

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

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
  var arr = [
    "tim", "wes", "ruth", "nic", "scott h", "charlie", "jon", "wilson", "aj", "john k", "jesse", "manoj", "clyde", "david", "andrew", "peter"
  ];
  arr = shuffle(arr);
  console.log(arr.join(","));
  return arr.join(", ");
}

function onInstallation(bot, installer) {
  if (installer) {
    bot.startPrivateConversation({ user: installer }, function(err, convo) {
      if (err) {
        console.log(err);
      } else {
        convo.say("I am a bot that has just joined your team");
        convo.say(
          "You must now /invite me to a channel so that I can be of use!"
        );
      }
    });
  }
}


/// @function pagerduty_message
/// @brief returns the PagerDuty response as a string
/// @param {String} line_separator the character used to separate lines
/// @returns {String} Flexibot's response
function pagerduty_message(line_separator) {

  if (typeof (line_separator) === 'undefined') {
    line_separator = "\n";
  }

  var response_lines = [
    "https://media.giphy.com/media/p9bj7nrUPAypq/giphy.gif",
    "DON'T PANIC!!",
    "Managing Response to Incidents: https://confluence.cms.gov/display/QPPGUIDE/Managing+Response+to+Incidents",
    "Incident Response Teams: https://confluence.cms.gov/display/QPPGUIDE/Incident+Response+Teams",
    "PagerDuty - Escalation Policies: https://confluence.cms.gov/display/QPPGUIDE/PagerDuty+-+Escalation+Policies"
  ];

  return response_lines.join (line_separator);
}


/// @function pagerduty_offline
/// @brief returns the PagerDuty response if called off-hours
/// @returns {String} Flexibot's response
function pagerduty_offhours(line_separator) {

  if (typeof (line_separator) === 'undefined') {
    line_separator = "\n";
  }

  var offhours = require ('./offhours/offhours');
  
  if (offhours.is_offhours (new Date())) {
    return pagerduty_message (line_separator);
  }

  return false;

}

/**
 * Configure the persistence options
 */

var config = {};
if (process.env.MONGOLAB_URI) {
  var BotkitStorage = require("botkit-storage-mongo");
  config = {
    storage: BotkitStorage({ mongoUri: process.env.MONGOLAB_URI })
  };
} else {
  config = {
    json_file_store: process.env.TOKEN
      ? "./db_slack_bot_ci/"
      : "./db_slack_bot_a/" //use a different name if an app or CI
  };
}

/**
 * Are being run as an app or a custom integration? The initialization will differ, depending
 */

if (process.env.TOKEN || process.env.SLACK_TOKEN) {
  //Treat this as a custom integration
  var customIntegration = require("./lib/custom_integrations");
  var token = process.env.TOKEN ? process.env.TOKEN : process.env.SLACK_TOKEN;
  var controller = customIntegration.configure(token, config, onInstallation);
} else if (
  process.env.CLIENT_ID &&
  process.env.CLIENT_SECRET &&
  process.env.PORT
) {
  console.log(process.env.CLIENT_ID);
  //Treat this as an app
  var app = require("./lib/apps");
  var controller = app.configure(
    process.env.PORT,
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    config,
    onInstallation
  );
} else {
  console.log(
    "Error: If this is a custom integration, please specify TOKEN in the environment. If this is an app, please specify CLIENTID, CLIENTSECRET, and PORT in the environment"
  );
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
controller.on("rtm_open", function(bot) {
  console.log("** The RTM api just connected!");
});

controller.on("rtm_close", function(bot) {
  console.log("** The RTM api just closed");
  // you may want to attempt to re-open
});

/**
 * Core bot logic goes here!
 */
// BEGIN EDITING HERE!

controller.on("bot_channel_join", function(bot, message) {
  bot.reply(message, "I'm here!");
});

controller.hears("hello", "direct_message", function(bot, message) {
  bot.reply(message, "Hello!");
});

controller.hears("weekend", "ambient", function(bot, message) {
  bot.reply(message, "WEEKEND!!!! YEAH!!! :taco: and :beer:");
});

controller.hears("monday", "ambient", function(bot, message) {
  bot.reply(message, "Mondays are horrible, so have some more :Coffee:!");
});

controller.hears("tuesday", "ambient", function(bot, message) {
  bot.reply(message, ":taco::taco::taco::taco::taco::taco::taco::taco::taco:");
});

controller.hears("Vacation", "ambient", function(bot, message) {
  bot.reply(message, "Just make sure you come back.");
});

controller.hears("Flexion", "ambient", function(bot, message) {
  bot.reply(message, "Flexion, Value Forward!");
});

controller.hears(
  ["Merry Christmas"],
  ["direct_mention", "mention", "direct_message"],
  function(bot, message) {
    bot.reply(
      message,
      "https://ic.pics.livejournal.com/aedit/60452602/124812/124812_original.gif"
    );
  }
);

controller.hears(
  ["hello", "hi", "greetings"],
  ["direct_mention", "mention", "direct_message"],
  function(bot, message) {
    bot.reply(message, "Hello!");
  }
);

controller.hears(
  ["flexibot weather"],
  ["direct_mention", "ambient", "direct_message"],
  function(bot, message) {
    var ta = message.text.split(" ");
    if (ta[2]) {
      var location = ta[2];
      console.log("Weather location is " + location);
      var weather = require("weather-js");
      weather.find({ search: location, degreeType: "F" }, function(
        err,
        result
      ) {
        if (err) console.log(err);
        console.log(JSON.stringify(result, null, 2));
        bot.reply(message, JSON.stringify(result));
      });
    } else {
      my_weather = "Please provide a zipcode of a town,state with no spaces";
      bot.reply(message, my_weather);
    }
  }
);

controller.hears(["standup_list"], ["ambient"], function(bot, message) {
  list = standup_list();
  console.log(list);
  bot.reply(message, list);
});

controller.hears(["tableflip"], ["ambient"], function(bot, message) {
  bot.reply(message, "http://gph.is/1a5Y3KD");
});

controller.hears(["oh no"], ["ambient"], function(bot, message) {
  bot.reply(message, "https://i.redd.it/y45cjik5n2b21.jpg");
});

controller.hears(["great scott"], ["ambient"], function(bot, message) {
  bot.reply(message, "https://imgur.com/HHEBL5Y");
});

controller.hears(["captain"], ["ambient"], function(bot, message) {
  bot.reply(message, "https://gph.is/1UwGeco");
});

controller.hears(["goodnews", "good news"], ["ambient"], function(bot, message) {
  bot.reply(message, "https://media.giphy.com/media/3zFcbgHoIXzykQc7vU/giphy.gif");
});

controller.hears(["shame"], ["ambient"], function(bot, message) {
  bot.reply(message, "https://media.giphy.com/media/vX9WcCiWwUF7G/200w_d.gif");
});



controller.hears(["timesheets"], ["ambient"], function(bot, message) {
  bot.reply(
    message,
    "https://media.giphy.com/media/3ornjXizVZDbngmjRK/giphy.gif"
  );
});

controller.hears(["facepalm"], ["ambient"], function(bot, message) {
  bot.reply(message, "https://gph.is/2B5NZmD");
});

controller.hears(["fistbump"], ["ambient"], function(bot, message) {
  bot.reply(message, "https://gph.is/2aYNzSb");
});

controller.hears(["love coffee"], ["ambient"], function(bot, message) {
  bot.reply(message, "https://gph.is/19womaE");
});

controller.hears(["taco"], ["ambient"], function(bot, message) {
  bot.reply(message, "http://gph.is/2961YfG");
});

controller.hears(["cowbell"], ["ambient"], function(bot, message) {
  bot.reply(message, "http://gph.is/1a6B565");
});

controller.hears(["beer"], ["ambient"], function(bot, message) {
  bot.reply(message, "https://gph.is/XKR6Yn");
});

controller.hears(["makeitso", "make it so"], ["ambient"], function(
  bot,
  message
) {
  bot.reply(message, "http://gph.is/2b6YjxW");
});

controller.hears(["thundercats ho"], ["ambient"], function(bot, message) {
  bot.reply(message, "https://gph.is/180SLfX");
});

controller.hears(["rimshot"], ["ambient"], function(bot, message) {
  bot.reply(message, "https://gph.is/1pWYb6M");
});

controller.hears(["awesome"], ["ambient"], function(bot, message) {
  bot.reply(
    message,
    "Team Awesome Sauce, brought to you by :coffee: and :beer:"
  );
});

controller.hears(["free bird", "freebird"], ["ambient"], function(
  bot,
  message
) {
  bot.reply(message, "AND THIS :bird: YOU CANNOT CHANGE!!!! ");
});

controller.hears(["Friday", "friday"], ["ambient"], function(bot, message) {
  day_of_week = new Date().getDay();
  switch (day_of_week) {
    case 6:
    case 0:
    case 1:
      bot.reply(message, "Friday was too far away...");
      break;
    case 2:
    case 3:
      bot.reply(
        message,
        `Only ${5 - day_of_week} days until Friday! :rockon:  `
      );
      break;
    case 4:
      bot.reply(message, "Only 1 day until Friday! :rockon:  ");
      break;
    case 5:
      bot.reply(message, "TGIF!!! :rockon:  ");
      break;
  }
});

controller.hears(["flexibot help"], ["ambient"], function(bot, message) {
  bot.reply(
    message,
    "to save type 'flexibot save urls name url', to list urls type 'flexibot list urls'  "
  );
});

controller.hears(["roll"], ["ambient"], function(bot, message) {
  var roll_var = message.text.split(" ");
  var dice = roll_var[1];
  var Roll = require("roll"),
    roll = new Roll();
  var Die = roll.roll(dice);
  var res = Die.result;
  bot.reply(message, "Result: " + res);
});

controller.hears(["flexibot save"], ["ambient"], function(bot, message) {
  var ta = message.text.split(" ");
  var type = ta[2];
  var name = ta[3];
  var item = ta[4];
  console.log(
    "logging info type:" + type + ", item:" + item + ", name: " + name
  );
  var json_to_store = '{ "item": "' + item + '" , "name": "' + name + '"}';
  var MongoClient = require("mongodb").MongoClient;
  var url = "mongodb://localhost:27017/";
  MongoClient.connect(
    url,
    { useNewUrlParser: true },
    function(err, db) {
      console.log("Connected correctly to server");
      if (err) throw err;
      var dbo = db.db("flexibot");
      dbo
        .collection(type)
        .insertOne(JSON.parse(json_to_store), function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
    }
  );
  console.log("JSON: " + json_to_store);
  bot.reply(message, "Flexibot has stored item of type: " + type);
});

controller.hears(["flexibot list"], ["ambient"], function(bot, message) {
  var ta = message.text.split(" ");
  var type = ta[2];
  console.log("type is " + type);
  var MongoClient = require("mongodb").MongoClient;
  assert = require("assert");
  var url = "mongodb://localhost:27017/";
  MongoClient.connect(
    url,
    { useNewUrlParser: true },
    function(err, db) {
      console.log("Connected correctly to server");
      if (err) throw err;
      var dbo = db.db("flexibot");
      dbo
        .collection(type)
        .find()
        .toArray(function(err, results) {
          assert.equal(err, null);
          assert.notEqual(results.length, 0);
          var response = "";
          results.forEach(function(result) {
            console.log(result.name + "," + result.item);
            response += "url: " + result.item + ", name: " + result.name + "\n";
          });
          bot.reply(message, response);
        });
    }
  );
});

controller.hears(["flexibot whois"], ["ambient"], function(bot, message) {
  var ta = message.text.split(" ");
  if (ta[2]) {
    var first_name = ta[2];
    var last_name = ta[3];
    var url = "";
    var confl_url =
      "https://confluence.cms.gov/dosearchsite.action?cql=siteSearch+~+";
    if (ta[3]) {
      console.log("name to look up is " + first_name + last_name);
      url =
        confl_url +
        "%22" +
        first_name +
        "+" +
        last_name +
        "%22&queryString=" +
        first_name +
        "+" +
        last_name;
    } else {
      console.log("name to look up is " + first_name);
      url = confl_url + "%22" + first_name + "%22&queryString=" + first_name;
    }
    bot.reply(message, url);
  } else {
    bot.reply(
      message,
      "usage: flexibot whois <first_name> {optional: <last_name>}"
    );
  }
});

controller.hears(["flexibot dbtest"], ["ambient"], function(bot, message) {
  var MongoClient = require("mongodb").MongoClient;
  var url = "mongodb://localhost:27017/";
  MongoClient.connect(
    url,
    { useNewUrlParser: true },
    function(err, db) {
      console.log("Connected correctly to server");
      bot.reply(message, "Connected to DB");
    }
  );
});

controller.hears(["flexibot remind me"], ["ambient"], function(bot, message) {
  var ta = message.text.split(" ");
  var type = ta[3];
  var name = ta[4];
  var MongoClient = require("mongodb").MongoClient;
  assert = require("assert");
  var url = "mongodb://localhost:27017/";
  MongoClient.connect(
    url,
    { useNewUrlParser: true },
    function(err, db) {
      console.log("Connected correctly to server");
      if (err) throw err;
      var dbo = db.db("flexibot");
      var query = ' { "name": "' + name + '"} ';
      var fields = '{ "name": true }';
      console.log(query);
      dbo
        .collection(type)
        .find(JSON.parse(query), [fields])
        .toArray(function(err, results) {
          assert.equal(err, null);
          assert.notEqual(results.length, 0);
          results.forEach(function(result) {
            console.log(result.name + "," + result.item);
            bot.reply(message, result.item);
          });
        });
    }
  );
});

controller.hears(["wisconsin"], ["ambient"], function(bot, message) {
  bot.createConversation(message, function(err, convo) {
    // create a path for when a user says YES
    convo.addMessage(
      {
        text: "You said yes! <@" + message.user + "> How wonderful."
      },
      "yes_thread"
    );

    // create a path for when a user says NO
    convo.addMessage(
      {
        text: "You said no, <@" + message.user + "> that is too bad."
      },
      "no_thread"
    );
    // path when user says maybe
    convo.addMessage(
      {
        text: "You said maybe, <@" + message.user + "> ... dont mess with me"
      },
      "maybe_thread"
    );
    convo.addMessage(
      {
        text:
          "I dont think I trust you, <@" +
          message.user +
          '>.  How does one "love" cheese, anyway? That is disgusting.'
      },
      "love_it_thread"
    );
    // create a path where neither option was matched
    // this message has an action field, which directs botkit to go back to the `default` thread after sending this message.
    convo.addMessage(
      {
        text: "Sorry,  <@" + message.user + "> I did not understand.",
        action: "default"
      },
      "bad_response"
    );

    // Create a yes/no question in the default thread...

    convo.addQuestion(
      "Do you like cheese?",
      [
        {
          pattern: "yes",
          callback: function(response, convo) {
            convo.gotoThread("yes_thread");
          }
        },
        {
          pattern: "no",
          callback: function(response, convo) {
            convo.gotoThread("no_thread");
          }
        },
        {
          pattern: "maybe",
          callback: function(response, convo) {
            convo.gotoThread("maybe_thread");
          }
        },
        {
          pattern: "love it",
          callback: function(response, convo) {
            convo.gotoThread("love_it_thread");
          }
        },
        {
          default: true,
          callback: function(response, convo) {
            convo.gotoThread("bad_response");
          }
        }
      ],
      {},
      "default"
    );

    convo.activate();
  });
});

controller.hears(
  [
    "flexibot what is",
    "flexibot what's",
    "flexibot whats",
    "wth is",
    "wtf is",
    "whodat",
    "who's that pokemon"
  ],
  ["ambient"],
  acronymicon
);

controller.hears (
  [
    "time"
  ],
  [
    "direct_mention", "mention", "direct_message"
  ],
  function (bot, message) {
    right_now = new Date();
    now_string = right_now.toString();
    bot.reply (message, now_string);
  }
);


controller.hears (
  [
  "pagerduty",
  "pager duty"
  ],
  [
    ["direct_mention", "mention", "direct_message"],
  ],
  function(bot, message) {
    bot.reply(message, pagerduty_message());
  }
);


controller.hears (
  [
  "pagerduty",
  "pager duty"
  ],
  [
    "ambient",
  ],
  function(bot, message) {
    bot.reply(message, pagerduty_offhours());
  }
);




controller.hears (
  new RegExp(/\W*((qpp|qta|waka|cmsawsops|tools|whsd)[a-z]*-[0-9]{1,5})\W*/, "gi"), ["ambient"], function(bot, message) {
  pattern = new RegExp(/\W*((qpp|qta|waka|cmsawsops|tools|whsd)[a-z]*-[0-9]{1,5})\W*/, "gi");

  var response_string = "";

  while (match = pattern.exec(message.text)) {
    ticket_number = match[0].toUpperCase();
    prefix = "*" + ticket_number + "*: ";
    suffix = "\n";
    url = "https://jira.cms.gov/browse/" + ticket_number;

    // only add URL if the message (from the user) and the response (from Flexibot)
    // does not include the URL to that ticket
    if ((message.text.indexOf (url) == -1)
    && (response_string.indexOf (url) == -1)) {
      response_string +=
        prefix
        + url
        + suffix;
    }
  }
  
  // only say something if there's something that needs to be said
  if (response_string != "") {
    bot.reply(message, response_string);
  }

});


/**
 * AN example of what could be:
 * Any un-handled direct mention gets a reaction and a pat response!
 */
controller.on("direct_message,mention,direct_mention", function(bot, message) {
  bot.api.reactions.add(
    {
      timestamp: message.ts,
      channel: message.channel,
      name: "robot_face"
    },
    function(err) {
      if (err) {
        console.log(err);
      }
      bot.reply(
        message,
        "I heard you loud and clear boss. Flexibot is a product of Kungfulinux, Inc. All thoughts and emotes are not necessarily the opinions of Kungfulinux, Inc.  Like calling Sfradkin boss."
      );
    }
  );
});

controller.middleware.receive.use(function(bot, message, next) {
  console.log("RECEIVED: ", message);
  message.logged = true;
  next();
});
controller.middleware.send.use(function(bot, message, next) {
  console.log("SENT: ", message);
  message.logged = true;
  next();
});
