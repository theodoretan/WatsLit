// use: var db = require("./db.js");


var dbUtil = require('./dbUtil');
var waterlooAPI = require('./waterlooApi');

var exports = {};

// use: db.initDatabase();
exports.initDatabase = function() {
    dbUtil.getDatabase()
    .then(() => dbUtil.getCollection())
    .then(() => waterlooAPI.getFedEvents())
    .then((res) => { res.forEach((obj) => { dbUtil.getEventDocument(obj) }) })
    .then(() => waterlooAPI.getClubEvents())
    .then((res) => { res.forEach((obj) => { dbUtil.getEventDocument(obj) }) })
    // .then((res) => { console.log( res )})
    .then(() => { dbUtil.exit(`Completed successfully`) })
    .catch((e) => { dbUtil.exit(`Completed with error ${JSON.stringify(e)}`) });
};

// use: db.updateDatabase();
exports.updateDatabase = function() {
    dbUtil.getDatabase()
    .then(() => dbUtil.getCollection())
    
    .then(() => { dbUtil.exit(`Completed successfully`) })
    .catch((e) => { dbUtil.exit(`Completed with error ${JSON.stringify(e)}`) });
};


// use: db.trendingEvents(callback, num);
exports.trendingEvents = function (callback, num=50) {
    let query = `SELECT TOP ${num} * FROM root r ORDER BY r.likes DESC`;

    dbUtil.getDatabase()
    .then(() => dbUtil.getCollection())
    .then(() => dbUtil.queryCollection(query))
    .then((res) => { callback(res) })
    .catch((e) => { dbUtil.exit(`Completed with error ${JSON.stringify(e)}`) });
};

// use: db.addLike(id, callback);
exports.addLike = function(id, callback) {
    let query = `SELECT VALUE r FROM root r WHERE r.id="${id}"`;

    dbUtil.getDatabase()
    .then(() => dbUtil.getCollection())
    .then(() => dbUtil.queryCollection(query))
    .then((res) => dbUtil.addEventLike(res))
    .then((res) => { callback(res) })
    .catch((e) => { dbUtil.exit(`Completed with error ${JSON.stringify(e)}`) });
};


// use: db.removeLike(id, callback);
exports.removeLike = function(id, callback) {
    let query = `SELECT VALUE r FROM root r WHERE r.id="${id}"`;
    
    dbUtil.getDatabase()
    .then(() => dbUtil.getCollection())
    .then(() => dbUtil.queryCollection(query))
    .then((res) => dbUtil.removeEventLike(res))
    .then((res) => { callback(res) })
    .catch((e) => { dbUtil.exit(`Completed with error ${JSON.stringify(e)}`) });
};

module.exports = exports;