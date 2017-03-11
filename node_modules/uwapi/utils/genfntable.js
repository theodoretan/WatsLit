#!/usr/bin/env node

var spec = require('../lib/uwapi')(null);

console.log('<table>');
console.log('<tr><th>endpoint</th><th>function</th><th>parameters</th></tr>');
for (var name in spec) {
	var templates = spec[name];
	for (var i = 0; i < templates.length; i++) {
		var results = templates[i].match(/{[^}]*}/g);
		console.log('<tr><td>' + templates[i] + '</td>');
		console.log('<td>' + name + '</td><td>');
		if(results) {
			console.log(results.map(function(e) { return e.replace(/^{|}$/g,''); }).join(", "));
		} else {
			console.log('None');
		}
		console.log('</td></tr>');
	}
}
console.log('</table>');

