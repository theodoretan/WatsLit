var querystring = require('querystring');
var https = require('https');
//Instantiate the client 
var uwaterlooApi = require('uwaterloo-api'); 
var uwclient = new uwaterlooApi({
  API_KEY : 'e4ddfdb1f26c7f9bc1a6b2084fcddee2'
});


module.exports = {
    testSearch: function(query,callback){
        uwclient.get('/events/holidays', function(err, res) {
            callback(res); 
        })
    }


    /*searchByKeyword: function (username, callback) {
        this.loadData('/users/' + querystring.escape(username), callback);
    },*/

    /*searchByDate: function (path, callback) {
        var options = {
            host: api.uwaterloo.ca,
            port: 443,
            path: path,
            method: 'GET',
            headers: {
                'User-Agent': 'sample-bot'
            }
        };
        var profile;
        var request = https.request(options, function (response) {
            var data = '';
            response.on('data', function (chunk) { data += chunk; });
            response.on('end', function () {
                callback(JSON.parse(data));
            });
        });
        request.end();
    }*/
}