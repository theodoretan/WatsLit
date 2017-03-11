"use strict";

var exports = module.exports = {};

var documentClient = require("documentdb").DocumentClient;
var config = require("./config");
var url = require('url');

var client = new documentClient(config.endpoint, { "masterKey": config.primaryKey });


var HttpStatusCodes = { NOTFOUND: 404 };
var databaseUrl = `dbs/${config.database.id}`;
var collectionUrl = `${databaseUrl}/colls/${config.collection.id}`;

// function getDatabase()
exports.getDatabase = function() {
    console.log(`Getting database:\n${config.database.id}\n`);

    return new Promise((resolve, reject) => {
        client.readDatabase(databaseUrl, (err, result) => {
            if (err) {
                if (err.code == HttpStatusCodes.NOTFOUND) {
                    client.createDatabase(config.database, (err, created) => {
                        if (err) reject(err)
                        else resolve(created);
                    });
                } else {
                    reject(err);
                }
            } else {
                resolve(result);
            }
        });
    });
};

// function exit(message) 
exports.exit = function(message) {
    console.log(message);
    console.log('Press any key to exit');
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
}

// getDatabase()
// .then(() => { exit(`Completed successfully`); })
// .catch((error) => { exit(`Completed with error ${JSON.stringify(error)}`) });


// function getCollection() 
exports.getCollection = function() {
    console.log(`Getting collection:\n${config.collection.id}\n`);

    return new Promise((resolve, reject) => {
        client.readCollection(collectionUrl, (err, result) => {
            if (err) {
                if (err.code == HttpStatusCodes.NOTFOUND) {
                    client.createCollection(databaseUrl, config.collection, { offerThroughput: 400 }, (err, created) => {
                        if (err) reject(err)
                        else resolve(created);
                    });
                } else {
                    reject(err);
                }
            } else {
                resolve(result);
            }
        });
    });
}


// function getEventDocument(document)
// adds events in if its not already there
exports.getEventDocument = function(document) {
    let documentUrl = `${collectionUrl}/docs/${document.id}`;
    console.log(`Getting document:\n${document.id}\n`);

    return new Promise((resolve, reject) => {
        client.readDocument(documentUrl, { partitionKey: document.district }, (err, result) => {
            if (err) {
                if (err.code == HttpStatusCodes.NOTFOUND) {
                    client.createDocument(collectionUrl, document, (err, created) => {
                        if (err) reject(err)
                        else resolve(created);
                    });
                } else {
                    reject(err);
                }
            } else {
                resolve(result);
            }
        });
    });
};



// function queryCollection(query) 
exports.queryCollection = function(query) {
    console.log(`Querying collection through index:\n${config.collection.id}`);

    let q = query;

    return new Promise((resolve, reject) => {
        client.queryDocuments(collectionUrl, q).toArray((err, results) => {
            if (err) reject(err)
            else {
                for (var queryResult of results) {
                    let resultString = JSON.stringify(queryResult);
                }
                console.log();
                resolve(results);
            }
        });
    });
};


// function replaceEventDocument(document) 
exports.replaceEventDocument = function(document) {
    let documentUrl = `${collectionUrl}/docs/${document.id}`;
    console.log(`Replacing document:\n${document.id}\n`);
    document.likes += 1;

    return new Promise((resolve, reject) => {
        client.replaceDocument(documentUrl, document, (err, result) => {
            if (err) reject(err);
            else {
                resolve(result);
            }
        });
    });
};


exports.addEventLike = function(document) {
    // document should come in as an array of one, so we just the first element
    document = document[0];
    let documentUrl = `${collectionUrl}/docs/${document.id}`;

    // add one like
    document.likes += 1;

    return new Promise((resolve, reject) => {
        client.replaceDocument(documentUrl, document, (err, result) => {
            if (err) reject(err);
            else {
                resolve(result);
            }
        });
    });
};


exports.removeEventLike = function(document) {
    document = document[0];
    let documentUrl = `${collectionUrl}/docs/${document.id}`;

    document.likes -= 1;

    return new Promise((resolve, reject) => {
        client.replaceDocument(documentUrl, document, (err, result) => {
            if (err) reject(err);
            else {
                resolve(result);
            }
        });
    });
};


// function deleteEventDocument(document) 
exports.deleteEventDocument = function(document) {
    let documentUrl = `${collectionUrl}/docs/${document.id}`;
    console.log(`Deleting document:\n${document.id}\n`);

    return new Promise((resolve, reject) => {
        client.deleteDocument(documentUrl, (err, result) => {
            if (err) reject(err);
            else {
                resolve(result);
            }
        });
    });
};

// function cleanup() 
exports.cleanup = function() {
    console.log(`Cleaning up by deleting database ${config.database.id}`);

    return new Promise((resolve, reject) => {
        client.deleteDatabase(databaseUrl, (err) => {
            if (err) reject(err)
            else resolve(null);
        });
    });
};

// getDatabase()
// .then(() => getCollection())
// .then(() => getEventDocument(config.documents.f301568))
// .then(() => getEventDocument(config.documents.f300607))
// .then(() => queryCollection('SELECT VALUE r.title FROM root r WHERE r.id = "f301568"'))
// // .then(() => replaceFamilyDocument(config.documents.Andersen))
// .then(() => queryCollection('SELECT VALUE r.title FROM root r WHERE r.id = "f301568"'))
// // .then(() => deleteFamilyDocument(config.documents.Andersen))
// .then(() => cleanup())
// .then(() => { exit(`Completed successfully`); })
// .catch((error) => { exit(`Completed with error ${JSON.stringify(error)}`) });


