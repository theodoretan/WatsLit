var querystring = require('querystring');
var https = require('https');
//Instantiate the client 
var uwaterlooApi = require('uwaterloo-api'); 
var uwclient = new uwaterlooApi({
  API_KEY : 'e4ddfdb1f26c7f9bc1a6b2084fcddee2'
});


module.exports = {
    searchEvents: function(start,end,type,callback){
        uwclient.get('/events', function(err, res) {
            var obj = [];
           for(var i = 0; i < res.data.length; i++){
                var curr = res.data[i];
                var startDate = new Date(curr.times[0].start);
                var endDate = new Date(curr.times[0].end);

                // TODO: use user's start and end dates
                var startString = new Date(start);
                var endString= new Date(end);
                if((!start & !end || startString <= startDate && endString >= endDate) && (!type || curr.type.includes(type))){
                   obj.push(curr);
                }
           }
           callback(obj);
        })
    }
    
}

