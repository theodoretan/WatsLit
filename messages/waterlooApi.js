var uwaterlooApi = require('uwaterloo-api'); 
var exports = {};
//Instantiate the client 
var uwclient = new uwaterlooApi({
  API_KEY : 'f927f8322fe4b8ddc1bf4625864a8ad0'
});

//Use the API 
// uwclient.get('/feds/events', function(err, res) {
//   console.log(res); 
// }); 

// uwclient.get('/events', function(err, res) {
//   console.log(res); 
// }); 

exports.getClubEvents = function() {
  return new Promise((resolve, reject) => {
    uwclient.get('/events', (err, res) => {
      if (err) reject(err)
      else {
        let data = res.data;
        let nData = data.map((obj) => {
          let nObj = {};
          nObj = updateData(obj, "c");
          return nObj;
        });
        // res.data = nData;
        resolve(nData)
      }
    });
  });
};


exports.getFedEvents = function() {
  return new Promise((resolve, reject) => {
    uwclient.get('/feds/events', (err, res) => {
      if (err) rejcect(err);
      else {
        let data = res.data;
        let nData = data.map((obj) => {
          var nObj = {};
          nObj = updateData(obj, "f");
          return nObj;
        });
        resolve(nData);
      }
    });
  });
};


// add f/c to the id and add the likes key
function updateData(json, char) {
  json.id = char + json.id;
  json.likes = 0;
  return json;
};



  // uwclient.get('/feds/events', function(err, res) {
  //   console.log(res); 
  // }); 


// uwclient.get('/courses/{course_sbuject}/{course_number}/schedule', {
//    course_subject : 'CS', 
//     course_number : 247
//   }, function(err, res) {
//     console.log(res);
// });

module.exports = exports;