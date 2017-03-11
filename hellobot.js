var builder = require('botbuilder');
var restify = require('restify');
var search = require('./search.js');

var connector = new builder.ChatConnector();
var bot = new builder.UniversalBot(connector);

var dialog = new builder.IntentDialog();
bot.dialog('/', [

    function (session, args, next) {
        if (session.message.text.toLowerCase() == 'search') {
            builder.Prompts.text(session, 'Who are you looking for?');
        } else {
            var query = session.message.text.substring(7);
            next({ response: query });
        }
    } , function (session, result, next) {
        var query = result.response;
        search.searchEventsByDate(query, function (response) {
            session.dialogData.property = null;
            builder.Prompts.text(session, response);  
        })
    }
]);

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
server.post('/api/messages', connector.listen());