var db = require('./db');
var waterlooAPI = require('./waterlooApi');

// db.addLike("f301568", printResults);
// db.removeLike("f301568", printResults);
// db.trendingEvents(printResults);

function printResults(response) {
    console.log(response);
}

// waterlooAPI.getFedEvents()
// .then((res) => { console.log(res) })
// .catch((e) => { console.log(e) });

// waterlooAPI.getClubEvents()
// .then((res) => { console.log(res) })
// .catch((e) => { console.log(e) });


// db.initDatabase();


db.trendingEvents(printResults, 5);
