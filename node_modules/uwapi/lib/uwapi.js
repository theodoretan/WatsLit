module.exports = function(apiToken) {
    var Url = require('url');
    var Q = require('q');

    //Utils

    //Should probably move this into a seperate module
    var getJSON = function(url, data, cb, cberr) {
       url = (url.constructor === Url.Url) ? url : Url.parse(url, true);
       delete url.search;
       for (var key in data) url.query[key] = data[key];

       var Http;

       if (url.protocol === 'http:')
           Http = require('http');
       else if (url.protocol === 'https:')
           Http = require('https');
       else {
           cberr(new Error('Unrecognized protocol'));
           return;
        }

       Http.get(url.format(), function(resp) {
           resp.setEncoding('utf8');
           var payload = '';
           resp.on('data', function(chunk) {
               payload += chunk;
           });
           resp.on('end', function() {
               try  {
                   payload = JSON.parse(payload);
               } catch(e) {
                   cberr(new Error('Request did not yield valid JSON data'));
                   return;
                }
               cb(payload);
           });
       }).on('error', cberr);
    };


    //Consumes an object and a template and returns the appropriate endpoint URL.

    var constructEndpoint = function(string, obj) {
        var params = string.match(/{(.*?)}/g) || [];

        var args = params.map(function(e){return e.replace(/{|}/g,'');});

        if(args.length !== Object.keys(obj).length) return null;

        for (var i in args) {
            if (typeof obj[args[i]] === 'undefined')
                return null;
            string = string.replace('{' + args[i] + '}', obj[args[i]]);
        }
        return string;
    };


    //Consumes a map of name-(template list) pairs of api endpoints
    //and returns an object with the specified methods.

    var compileAPISpec = function(spec) {
        var baseURL='https://api.uwaterloo.ca/v2';
        var result = {};

        for (var name in spec) {
            var templates = spec[name];
            var cached = {};
            var endpointFunction = (function(templates, fname, cached) {
                    return function(options, getParams) {
                            options = options || {};
                            getParams = getParams || {};

                            var deferred = Q.defer();
                            var path = null;
                            for (var i in templates) {
                                path = constructEndpoint(templates[i], options);
                                if(path)
                                    break;
                            }

                            if(!path) {
                                deferred.reject(new Error('Invalid parameters passed in to ' + fname));
                                return deferred.promise;
                            }

                            if(cached[path]) {
                                deferred.resolve(cached[path]);
                                return deferred.promise;
                            }

                            var url = baseURL + path + '.json';

                            getParams.key = apiToken;

                            getJSON(url, getParams, function(payload){
                                if(Math.floor(payload.meta.status / 100) !== 2) {
                                    deferred.reject(new Error('API Error: ' + payload.meta.message));
                                    return;
                                }
                                cached[path] = payload.data;
                                deferred.resolve(payload.data);
                            }, function(e) {
                                deferred.reject(e);
                            });
                            return deferred.promise;
                    };
                })(templates, name, cached);
            result[name] = endpointFunction;
        }
        return result;
    };

    //Consumes raw API templates and generates a spec object
    var genSpec = function(templates) {
       //Suggests a function name from the provided API template

       var getName = function(url) {
          url = (url instanceof Url.Url) ? url : Url.parse(url);
          var args = url.path.replace(/^\/|\/$/g,'').split('/');

          if (args[args.length-1][0] === '{' || args.length === 1)
              return args[0];
          else
              return args[0] + args[args.length-1][0].toUpperCase() +
                     args[args.length-1].slice(1);
       };

       var result = {};
       for(var i=0;i<templates.length;i++) {
           var name = getName(templates[i]);
           if(!result[name]) result[name] = [];
           result[name].push(templates[i]);
       }
       return result;
    };


    //Spec must contain a mapping of function names to templates. No two templates
    //in the list can accept the same set of parameteres..

    var validSpec = function(spec) {

        for(var name in spec) {
            var seen = {};
            for(var i in spec[name]) {
               var template = spec[name][i];
               var params = template.match(/{.*?}/g) || [];
               var hash = params.sort().join();
               if(seen[hash])
                   return new Error('Found duplicate parameter list for templates in ' + name);
               seen[hash] = 1;
            }
        }
        return true;
    };

    var templates = [
        '/foodservices/menu',
        '/foodservices/notes',
        '/foodservices/diets',
        '/foodservices/outlets',
        '/foodservices/locations',
        '/foodservices/watcard',
        '/foodservices/announcements',
        '/foodservices/products/{product_id}',
        '/foodservices/products/search',
        '/foodservices/{year}/{week}/menu',
        '/foodservices/{year}/{week}/notes',
        '/foodservices/{year}/{week}/announcements',
        '/courses/{subject}',
        '/courses/{course_id}',
        '/courses/{class_number}/schedule',
        '/courses/{subject}/{catalog_number}',
        '/courses/{subject}/{catalog_number}/schedule',
        '/courses/{subject}/{catalog_number}/prerequisites',
        '/courses/{subject}/{catalog_number}/examschedule',
        '/events',
        '/events/{site}',
        '/events/{site}/{id}',
        '/events/holidays',
        '/news',
        '/news/{site}',
        '/news/{site}/{id}',
        '/weather/current',
        '/terms/list',
        '/terms/{term_id}/examschedule',
        '/terms/{term_id}/{subject}/schedule',
        '/terms/{term_id}/{subject}/{catalog_number}/schedule',
        '/terms/{term_id}/infosessions',
        '/resources/tutors',
        '/resources/printers',
        '/resources/infosessions',
        '/resources/goosewatch',
        '/resources/sites',
        '/codes/units',
        '/codes/terms',
        '/codes/groups',
        '/codes/subjects',
        '/codes/instructions',
        '/buildings/list',
        '/buildings/{building_acronym}',
        '/buildings/{building_acronym}/{room_number}/courses',
        '/api/usage',
        '/api/services',
        '/api/methods',
        '/api/versions',
        '/api/changelog',
        '/server/time',
        '/server/codes'
    ];

    var spec = genSpec(templates);

    //Return spec if apiToken is not provided

    if(apiToken === null) {
        return spec;
    }

    var result = validSpec(spec);

    if (result instanceof Error) {
            throw new Error('Could not generate valid spec using the given template' +
                      result.message);
    }

    var uwapi = compileAPISpec(spec);

    return uwapi;
};
