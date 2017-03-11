var querystring = require('querystring');
var https = require('https');

module.exports = {
    help: function(callBack) {
    var commands = ["Search: looks for events around you, you can use keywords and dates to specify what you're looking for", "For example you can type something like 'search party today' for a specific event", "You can come back to this menu at any time by typing 'help'"];
    var events =  ['* Information session', '* Workshop', '* Lecture', '* Conference', '* Seminar', '* Open house', '* Reception', '* Performance', '* Thesis defence', '* Reunion', '* Meeting'];
    
    var textResponse = "###How to use WatsLit\n\n" + commands[0] + "\n" + ">" + commands[1] + "\n\n" + "The list of categories you can use with search are:" + "\n\n";

    for (var i = 0; i < events.length; i++){
        textResponse += events[i] + "\n\n";
    }
    textResponse += commands[2];
    
    callBack(textResponse);
    }
}