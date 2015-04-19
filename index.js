if (!global._) {
	global._ = require('lodash');
}

if (!global.Promise) {
	global.Promise = require('bluebird');
}

var fsutils = require('./fsutils');
var results = require('./results');
var handlers = require('./handlers');

function startSimplewSync (config) {
	config = config || {};

	var express = require('express');
	var dot = require('express-dot');

	var app = express();

	app.set('trust proxy', true);
	app.set('views', config.views || fsutils.getDefaultPathSync('views'));
	app.engine('html', dot.__express);
	app.set('view engine', 'html');

	var controllers = fsutils.loadSync(config.controllers || fsutils.getDefaultPathSync('controllers'));
	handlers.setupRouterSync(app, controllers, config.stderr || console.error);

	if (config.assets) {
		app.use(express.static(_.isString(config.assets)
			? config.assets
			: fsutils.getDefaultPathSync('assets')
		));
	}
	
	var port = config.port || 3000;
	app.listen(port);

	return app;
};

module.exports = startSimplewSync;

module.exports.results = results;
module.exports.fsutils = fsutils;
