var builder = require('botbuilder');
var restify = require('restify');
var search = require('./search.js');

var connector = new builder.ChatConnector();
var bot = new builder.UniversalBot(connector);

// LUIS connection
var recognizer = new builder.LuisRecognizer("https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/deecd678-4dca-4736-bc93-f3982e1ae346?subscription-key=8a9b1636e26d4a7a8788c900a0aa98e6&verbose=true");
bot.recognizer(recognizer);

var dialog =  new builder.IntentDialog({recognizers:[recognizer]});

bot.dialog('/',dialog);
dialog.matches('Greeting', [
    // Search input
    function (session, args, next) {
        if (session.message.text.toLowerCase() == 'search') {
            builder.Prompts.text(session, 'Who are you looking for?');
        } else {
            var query = session.message.text.substring(7);
            next({ response: query });
        }
    },

    // Create the carousel
    function (session, result, next) {
        var query = result.response;
        search.searchEvents("2017-03-24T09:45:00-04:00", "2017-03-26T09:45:00-04:00", query, function (response) {
            session.dialogData.property = null;
            
             var cards = []; //getCardsAttachments();
            for(var i=0; i<response.length; ++i){
                console.log(response[i]);
                cards.push(
                    new builder.HeroCard(session)
            .title(response[i].title)
            .subtitle("This program starts at: " + response[i].times[0].start)
            .text('This event is run by: ' + response[i].site_name)
            .images([
                builder.CardImage.create(session, 'https://raw.githubusercontent.com/PragashSiva/bart/master/Null-Photo-Image.jpg')
            ])
            .buttons([
                builder.CardAction.openUrl(session, response[i].link , 'Learn More')
            ])


                );
            }

            // create reply with Carousel AttachmentLayout
            var reply = new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments(cards);

            session.send(reply);

        })
    }
]);

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
server.post('/api/messages', connector.listen());

