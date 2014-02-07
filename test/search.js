var async = require('async');

var tmdb = require('../lib/tmdb')('YOUR_API_KEY', function(err, tmdb) {

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
	
});

