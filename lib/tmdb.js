var url = require('url');
var request = require('request');

var tmdb = {
	api_key: null,
	configuration: null,
	init: function(api_key, options, done) {
		if(!api_key)
			throw new Error('Api key missing');

		var self = tmdb;

		self.api_key = api_key;

		if(options && options.secure)
			self.protocol = 'https:';

		return self;
				
	},
	host: 'api.themoviedb.org',
	path: '/3',
	protocol: 'http:',
	build_url: function(type, options) {
		var self = this;

		options = options === undefined ? {} : options;

		options.api_key = this.api_key;

		return url.format({
			host: self.host,
			protocol: self.protocol,
			pathname: [self.path, type].join('/'),
			query: options
		});
	},
	//rewriting poster paths
	posters: function(res) {
		var conf = this.configuration.images;

		for(var i in res) {
			if(typeof res[i] == 'object')
				res[i] = this.posters(res[i]);
			else if(i.indexOf('poster') !== -1 || i.indexOf('backdrop') !== -1 || i.indexOf('logo') !== -1 || i.indexOf('profile') !== -1) {
				var url = this.protocol == 'http:' ? conf.base_url : conf.secure_base_url;
					url += 'original'+res[i];
				res[i] = url;
			}
		}

		return res;
	},
	getConfiguration: function(done) {
		var self = this;
		//console.log('Fetching configuration');

		request({url: self.build_url('configuration'), json: true}, function(err, resp, conf) {

			if(err)
				console.error(err);

			self.configuration = conf;

			done(err, self);
		});
	
	},
	fetch: function(url, done) {
		var self = this;

		var next = function() {
			request({url: url, json: true}, function (error, response, body) {

				if (response && !error && response.statusCode == 200) {
					done(null, body);
				} else if(response) {
					console.error(error, response.statusCode);
					done(error, {});
				} else {
					console.error(error);
					done(error, {});
				}
			});
		}

		if(!self.configuration) {
			self.getConfiguration(next);
		} else {
			next();
		}

		//console.log('Fetching ', url);

	},
	infos: function(type, code, options, done) {
		if(arguments.length == 3)
			done = options;

		var self = this;

		this.fetch(this.build_url(type+'/'+code, options), function(err, results) {
			done(err, self.posters(results));
		});
	},
	search: function(type, options, done) {
		var self = this;

		this.fetch(this.build_url('search/'+type, options), function(err, results) {
			done(err, self.posters(results));
		});
	}	
}

module.exports = function(api_key, options, done) {
	if(arguments.length == 2) {
		done = options; 
		options = {};
	}

	return tmdb.init(api_key, options, done);
}