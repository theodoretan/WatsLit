var builder = require('botbuilder');
var restify = require('restify');

var connecter = new builder.ChatConnector();
var bot = new builder.UniversalBot(connecter);

bot.dialog('/', [
    function(session) {
        builder.Prompts.text(session, 'what you want?');
    }, function(session, result) {
        if (result.response === 'help'){
            session.beginDialog('/help');
        }
    }
]);

bot.dialog('/help', function(session){
    var commands = ["Search: looks for events around you, you can use keywords and dates to specify what you're looking for", "For example you can type something like 'search party today' for a specific event", "You can come back to this menu at any time by typing 'help'"];
    var events =  ['* Information session', '* Workshop', '* Lecture', '* Conference', '* Seminar', '* Open house', '* Reception', '* Performance', '* Thesis defence', '* Reunion', '* Meeting'];
    var helpReply = new builder.Message(session);
    
    var textResponse = "###How to use WatsLit\n\n" + commands[0] + "\n" + ">" + commands[1] + "\n\n" + "The list of categories you can use with search are:" + "\n\n";

    helpReply.text();
    for (var i = 0; i < events.length; i++){
        textResponse += events[i] + "\n\n";
    }
    textResponse += commands[2];
    helpReply.text(textResponse);
    helpReply.attachments = commands;
    session.send(helpReply);
});

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log('%s listening to %s',  server.name, server.url);
});
server.post('/api/messages', connecter.listen());