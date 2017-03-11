var uwapi = require('../lib/uwapi');
var apiToken = process.env.uwApiToken;

describe('uwapi', function() {
    this.timeout(0);
    var uwapiObj = uwapi(apiToken);


    describe('token authentication', function() {
        it('should reject invalid apiTokens', function(done) {
            var uwapiObj = uwapi('junk');
            uwapiObj.apiUsage().then(function() { done('apiToken perceived as valid'); }, function() { done(); });
        });

        it('should accept valid apiTokens', function(done) {
            uwapiObj.apiUsage().then(function() { done(); }, function() { done('invalid token'); });
        });
    });

    describe('endpoints which accept GET parameters', function() {
        it('should acknowledge GET paramteters', function(done) {
            uwapiObj.foodservicesSearch({},{'calories.gt': 0}).then(function(r) {
                done(r.length ? null : 'No data returned');
            }, function(e) { done('failed: ' + e.message); });
        });
    });

    describe('all other endpoints', function() {
        var  endpoints = uwapi(null);

        Object.keys(endpoints).forEach(function(fname) {
            endpoints[fname].forEach(function(template) {
                var opts = template.match(/{([^}]*)/g);
                var result = {};

                if(opts) {
                    for(var i in opts) {
                        var opt = opts[i].replace(/[{}]/g, '');
                        result[opt] = '42';
                    }
                }

                it('should yield a valid response from ' + fname + ': ' + JSON.stringify(result), function(done) {
                    console.log(fname);
                    uwapiObj[fname](result).then(function(e) {
                        done();
                    }, function(e) {
                        done('error on ' +  fname + ': ' + e.message);
                    });
                });
            });
        });
    });
});
