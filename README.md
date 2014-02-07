tmbd
====

TheMovieDB nodejs API wrapper
Really basic, only provides '/search/:type' and '/:type/:id' methods.

For API routes list : http://docs.themoviedb.apiary.io/

```
//This is async to make sure configuration is complete, I'll find a way of doing it synchronously if I've some time
var tmdb = require('tmdb-3')('YOUR_API_KEY', function(err, tmdb) {
	
	//Searching
	tmdb.search('movie', {query: 'Harry Potter', language: 'fr'}, function (err, results) {
		//Informations on first ID
		tmdb.infos('movie', results.results[0].id, {language: 'fr'}, function (err, results) {

			console.log(results);

		});
	});
});

```