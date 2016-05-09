var Botkit = require('botkit');

// Expect a SLACK_TOKEN environment variable
var slackToken = process.env.SLACK_TOKEN;
if (!slackToken) {
  console.error('SLACK_TOKEN is required!');
  process.exit(1);
}

var controller = Botkit.slackbot();
var bot = controller.spawn({
  token: slackToken
});

bot.startRTM(function (err, bot, payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});

controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, "I'm here!");
});

controller.hears(['hello', 'hi'], ['direct_mention'], function (bot, message) {
  bot.reply(message, 'Hello.');
});

controller.hears(['hello', 'hi'], ['direct_message'], function (bot, message) {
  bot.reply(message, 'Hello.');
  bot.reply(message, 'It\'s nice to talk to you directly.');
});

controller.hears('.*', ['mention'], function (bot, message) {
  bot.reply(message, 'You really do care about me. :heart:');
});

controller.hears('help', ['direct_message', 'direct_mention'], function (bot, message) {
  var help = 'I will respond to the following messages: \n' +
      '`bot hi` for a simple message.\n' +
      '`bot attachment` to see a Slack attachment message.\n' +
      '`@<your bot\'s name>` to demonstrate detecting a mention.\n' +
      '`bot help` to see this again.';
  bot.reply(message, help);
});

controller.hears(['attachment'], ['direct_message', 'direct_mention'], function (bot, message) {
  var text = 'Beep Beep Boop is a ridiculously simple hosting platform for your Slackbots.';
  var attachments = [{
    fallback: text,
    pretext: 'We bring bots to life. :sunglasses: :thumbsup:',
    title: 'Host, deploy and share your bot in seconds.',
    image_url: 'https://storage.googleapis.com/beepboophq/_assets/bot-1.22f6fb.png',
    title_link: 'https://beepboophq.com/',
    text: text,
    color: '#7CD197'
  }];

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {
    console.log(err, resp);
  });
});

controller.hears('invite', ['direct_message', 'direct_mention'], function(bot, message) {
  console.log("MESSAGE: " + JSON.stringify(message));
  bot.reply(message, "Ok coming right up!");
  var users = message.text.split(" ");
  var foundTo = false;
  var usersToDm = [];
  var room;
  for(var user of users) {
    if(user[0] === "<" && !foundTo) {
      usersToDm.push(user.substring(2, user.length-1));
    }
    if(foundTo) {
      room = user.split("|")[1];
      room = room.substring(0, room.length-1);
    }
    if(user === "to" ) {
      foundTo = true;
    }
  }
  for(var dm of usersToDm) {
    inviteToMeeting(dm, room, bot, message);
  }
});

var inviteToMeeting = function(user, room, bot, message) {
  var directMessage = JSON.parse(JSON.stringify(message));
  directMessage.user = user;
  var invite = "Click this link to join https://my.foxden.io/#/join/" + room;
  console.log("INVITE: " + invite);
  bot.startPrivateConversation(directMessage, function(err, dm) {
    dm.say('Hi! You have been invited to foxden meeting with: <@' + message.user + ">");
    dm.say(invite);
  });
};

controller.hears('.*', ['direct_message', 'direct_mention'], function (bot, message) {
  bot.reply(message, 'Sorry <@' + message.user + '>, I don\'t understand. \n');
});
