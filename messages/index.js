/*-----------------------------------------------------------------------------
This template demonstrates how to use an IntentDialog with a LuisRecognizer to add 
natural language support to a bot. 
For a complete walkthrough of creating this type of bot see the article at
http://docs.botframework.com/builder/node/guides/understanding-natural-language/
-----------------------------------------------------------------------------*/
"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var restify = require('restify');
var search = require('./search.js');

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'api.projectoxford.ai';

// const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v1/application?id=' + luisAppId + '&subscription-key=' + luisAPIKey;
const url = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/deecd678-4dca-4736-bc93-f3982e1ae346?subscription-key=8a9b1636e26d4a7a8788c900a0aa98e6&verbose=true";
// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(url);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] })
/*
.matches('<yourIntent>')... See details at http://docs.botframework.com/builder/node/guides/understanding-natural-language/
*/
.matches('None', (session, args) => {
    session.send('Hi! This is the None intent handler. You said: \'%s\'.', session.message.text);
})
.onDefault((session) => {
    session.send('Sorry, I did not understand \'%s\'.', session.message.text);
});

bot.dialog('/', dialog);    


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



if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}

