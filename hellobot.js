var builder = require('botbuilder');
var restify = require('restify');
var search = require('./search.js');

var connector = new builder.ChatConnector();
var bot = new builder.UniversalBot(connector);

function getCardsAttachments(session) {
    return [
        new builder.HeroCard(session)
            .title('Azure Storage')
            .subtitle('Offload the heavy lifting of data center management')
            .text('Store and help protect your data. Get durable, highly available data storage across the globe and pay only for what you use.')
            .images([
                builder.CardImage.create(session, 'https://docs.microsoft.com/en-us/azure/storage/media/storage-introduction/storage-concepts.png')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/services/storage/', 'Learn More')
            ]),

        new builder.ThumbnailCard(session)
            .title('DocumentDB')
            .subtitle('Blazing fast, planet-scale NoSQL')
            .text('NoSQL service for highly available, globally distributed apps—take full advantage of SQL and JavaScript over document and key-value data without the hassles of on-premises or virtual machine-based cloud database options.')
            .images([
                builder.CardImage.create(session, 'https://docs.microsoft.com/en-us/azure/documentdb/media/documentdb-introduction/json-database-resources1.png')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/services/documentdb/', 'Learn More')
            ])
            
            ];
    }


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
        search.searchEvents("2017-03-24T09:45:00-04:00", "2017-03-26T09:45:00-04:00", query, function (response) {
            session.dialogData.property = null;
            
             var cards = []; //getCardsAttachments();
            for(var i=0; i<response.length; ++i){
                console.log(response[i]);
                cards.push(
                    new builder.HeroCard(session)
            .title(response[i].title)
            .subtitle("This program starts at: " + response[i].times[0].start)
            .text(response[i].link + ' is the link for more information.')
            .images([
                builder.CardImage.create(session, 'https://docs.microsoft.com/en-us/azure/storage/media/storage-introduction/storage-concepts.png')
            ])
            .buttons([
                builder.CardAction.openUrl(session, response[i].link, 'Learn More')
            ])


                );
            }

          //   function getCardsAttachments(session) {
    // return [
    //     new builder.HeroCard(session)
    //         .title('Azure Storage')
    //         .subtitle('Offload the heavy lifting of data center management')
    //         .text('Store and help protect your data. Get durable, highly available data storage across the globe and pay only for what you use.')
    //         .images([
    //             builder.CardImage.create(session, 'https://docs.microsoft.com/en-us/azure/storage/media/storage-introduction/storage-concepts.png')
    //         ])
    //         .buttons([
    //             builder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/services/storage/', 'Learn More')
    //         ]) ]
           

    // create reply with Carousel AttachmentLayout
    var reply = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(cards);

    session.send(reply);

        })
    }
    
    // , function (session, result, next) {  

    //     var username = result.response.entity;
    //     githubClient.loadProfile(username, function (profile) {
    //         var card = new builder.ThumbnailCard(session);

    //         card.title(profile.login);

    //         card.images([builder.CardImage.create(session, profile.avatar_url)]);

    //         if (profile.name) card.subtitle(profile.name);

    //         var text = '';
    //         if (profile.company) text += profile.company + ' \n';
    //         if (profile.email) text += profile.email + ' \n';
    //         if (profile.bio) text += profile.bio;
    //         card.text(text);

    //         card.tap(new builder.CardAction.openUrl(session, profile.html_url));
            
    //         var message = new builder.Message(session).attachments([card]);
    //         session.send(message);
    //     });
    // }
]);

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
server.post('/api/messages', connector.listen());

