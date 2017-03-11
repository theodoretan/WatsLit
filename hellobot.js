var builder = require('botbuilder');
var restify = require('restify');
var search = require('./search.js');
var specialChars = require('underscore');


var connector = new builder.ChatConnector();
var bot = new builder.UniversalBot(connector);
var types = ['Information session', 'Workshop', 'Lecture', 'Conference', 'Seminar', 'Open house', 'Reception', 'Performance', 'Thesis defence', 'Reunion', 'Meeting']

// LUIS connection
var recognizer = new builder.LuisRecognizer("https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/deecd678-4dca-4736-bc93-f3982e1ae346?subscription-key=8a9b1636e26d4a7a8788c900a0aa98e6&verbose=true");
bot.recognizer(recognizer);

var dialog =  new builder.IntentDialog({recognizers:[recognizer]});



bot.dialog('/',dialog);
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
              var datetime = Date.parse(response[i].times[0].start);
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
         builder.Prompts.choice("Here's a full list of options.",types)
    }
]);

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
server.post('/api/messages', connector.listen());

