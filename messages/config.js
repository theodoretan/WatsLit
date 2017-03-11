
var config = {}

config.endpoint = "https://waterlit.documents.azure.com:443/";
config.primaryKey = "1TvDXekns4CAuRd9d2Gs9JAmV9JICKposyityz9xo7NdT01OD0b39ni8Dv053djFDAjFDhPq29Khh0YneBAjnA==";



config.database = {
    "id": "EventDB"
};

config.collection = {
    "id": "EventCol"
};

config.documents = {
    "f301568": {
      "id":"f301568",
      "likes": 0,
      "title":"Sex Toy Bingo - Test",
      "location":"200 University Ave, Waterloo, N2L3G1, Canada",
      "start":"2016-01-11T19:00:00-05:00",
      "end":"2016-01-11T23:55:00-05:00",
      "categories":[
        "Events"
      ],
      "updated":"2016-01-08T17:20:11-05:00",
      "url":"http:\/\/www.feds.ca\/event\/sex-toy-bingo-5\/"
    },
    "f300607": {
      "id":"f300607",
      "likes": 0,
      "title":"Volunteer Fair - Test",
      "location":null,
      "start":"2016-01-12T11:00:00-05:00",
      "end":"2016-01-12T14:00:00-05:00",
      "categories":[
        "Events"
      ],
      "updated":"2016-01-04T17:10:44-05:00",
      "url":"http:\/\/www.feds.ca\/event\/volunteer-fair-2\/"
    }
};

module.exports = config;