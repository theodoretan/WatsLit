# UWAPI

This node module is a wrapper for the UW OpenData API. It is asynchronous but
promised based and so presents a cleaner interface than traditional callbacks
while still remaining efficient.

## Installation

Simply run

```
npm install uwapi
```

in the target project. The value returned
by require('uwapi') is a constructor that
consumes an api token and returns an object
with methods for making queries.


```javascript
var apiToken = 'blarg';
var uwapi = require('uwapi')(apiToken);
uwapi.buildingsList().then(function(buildings) {
	// Do something
});
```
## Dependencies

The package depends on kris kowal's Q library implementation of promises
which should automatically be installed by npm.

## Usage

Each endpoint is implemented as a function that returns a promise which resolves
to the data payload obtained by the querying the endpoint with the provided
parameters. Each endpoint path corresponds to a specific function as found in
the [REFERENCE.md](REFERENCE.md) file. Parameters are expected to be passed in to these
functions as an object where the key corresponds to the parameter name.
GET parameters can optionally be passed as a second argument.

## Example

```javascript

//A 'normal' endpoint (the bulk of them)

uwapi.buildingsList().then(function(buildings) {
	for(var building in buildings) {
		// Do something here
	}
	return processedBuildings;
}).then(function(processedBuildings) {
	// Do something with processedBuildings
}, function(err) {
	// Handle errors
});


//Endpoints which take GET parameters.

uwapi.foodservicesSearch({}, {'calories.lt': 600}).then(console.log, console.error);
uwapi.poorlyDesignedEndpoint({embededParam1: embededVal}, {getParam1: getVal}).then(console.log, console.error);

```

## Tests

Set the environment variable uwApiToken and run 'npm test'

## Changelog


###v1.1.1

 - Updated baseURL to use secured endpoints

###v1.1.0

 - Added optional support for GET parameters (see [README.md](README.md))
 - Added the foodservicesSearch endpoint
 - Added the resourcesSites endpoint

###1.0.4

 - Allow empty responses to propagate rather than throwing an error

###v1.0.3

 - Make function names more consistent with endpoints


## Bugs / Feature Requests

Please email any bugs or feature requests to rvaiya@uwaterloo.ca

## Contributions

Feel free to fork and issue Pull Requests.
