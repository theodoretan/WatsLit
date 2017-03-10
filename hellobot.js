var builder = require('botbuilder');
var restify = require('restify');

var connector = new builder.ChatConnector();
var bot = new builder.UniversalBot(connector);
bot.dialog('/', [
    function(session) {
        builder.Prompts.text(session, 'What is your name?');
    },
    function(session, results) {
        session.send('Hello, ' + results.response);
    }
]);

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
server.post('/api/messages', connector.listen());