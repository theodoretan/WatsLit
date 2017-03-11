var uwaterlooApi = require('uwaterloo-api'); 

//Instantiate the client 
var uwclient = new uwaterlooApi({
  API_KEY : 'f927f8322fe4b8ddc1bf4625864a8ad0'
});

//Use the API 
uwclient.get('/feds/events', function(err, res) {
  console.log(res); 
}); 

uwclient.get('/events/holidays', function(err, res) {
  console.log(res); 
}); 


uwclient.get('/courses/{course_sbuject}/{course_number}/schedule', {
   course_subject : 'CS', 
    course_number : 247
  }, function(err, res) {
    console.log(res);
});