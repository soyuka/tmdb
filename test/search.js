var async = require('async');

var tmdb = require('../lib/tmdb')('7c5105894b0446bb59b01a30cf235f3b');

async.series([
	function(done) {
		console.log('Search for Movies Harry Potter');
		tmdb.search('movie', {query: 'Harry Potter', language: 'fr'}, function (err, results) {
			if(err)
				console.log(err);

			console.log('Infos on first match');
			tmdb.infos('movie', results.results[0].id, {language: 'fr'}, function (err, results) {
				if(err)
					console.log(err);

				console.log(results);
				done();

			});
		});
	},
	function(done) {
		console.log('Search for TVSeries Leverage');
		tmdb.search('tv', {query: 'Leverage', language: 'fr'}, function (err, results) {
			if(err)
				console.log(err);

			console.log('Infos on first match');
			tmdb.infos('tv', results.results[0].id, {language: 'fr'}, function (err, results) {
				if(err)
					console.log(err);

				console.log(results);
				done();
			});
		});
	}
], function(err, results) {
	console.log('Done testing with error', err);
	process.exit(0);
});


