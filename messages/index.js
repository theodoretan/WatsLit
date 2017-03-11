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
var help = require('./help.js');
var specialChars = require('underscore');

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);

var types = ['Information session', 'Workshop', 'Lecture', 'Conference', 'Seminar', 'Open house', 'Reception', 'Performance', 'Thesis defence', 'Reunion', 'Meeting']


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
    function (session,result, args) {
      //  if (session.message.text.toLowerCase() == 'search') {
        session.send("Hey! I'm the WatsLit Bot! I know everything about what's lit at UWaterloo! To start off, here are some trending events: ");
        
        var query = result.response;
        search.searchEvents(null,null, "Workshop", function (response) {
            session.dialogData.property = null;
            
            // display the cards
            var cards = []; 
            for(var i=0; i<10; ++i){
                console.log(response[i]);
                cards.push(

                            new builder.HeroCard(session)
                    .title(specialChars.unescape(response[i].title).replace("&#039;","'"))
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
            builder.Prompts.text(session, "Try a type of event (e.g. workshops, gala)");
            session.endDialog();
        })
    }
]);

dialog.matches('Event Search',[
       // Create the carousel
       
    function (session,args, next) {
        console.log(args.entities[1].resolution.date);
        var time = new Date(args.entities[1].resolution.date);
        time = time.toISOString();
        console.log(time);
        var query = args.entities[0].type;
      
        builder.Prompts.text(session, "Here's what I found:");
        search.searchEvents(time, "2017-03-26T09:45:00-04:00", query, function (response) {
            session.dialogData.property = null;
 
             var cards = []; //getCardsAttachments();
            for(var i=0; i<10; ++i){
              var datetime =new Date( Date.parse(response[i].times[0].start));
                console.log(response[i]);
                cards.push(
                    new builder.HeroCard(session)
            .title(specialChars.unescape(response[i].title).replace("&#039;", "'"))
            .subtitle("This program starts at: " + datetime)
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
            session.endDialog();

        })
    }
]);

dialog.matches('Help',[
       // Create the carousel
    function (session, result, next) {
        var helpReply;
        help.help(function(helpReply){
            session.send(helpReply);
        });
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

