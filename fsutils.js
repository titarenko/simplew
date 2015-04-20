var fs = require('fs');
var path = require('path');

function getDefaultPathSync (basedir, directory) {
	if (!directory) {
		directory = basedir;
		basedir = __dirname + '/../../';
	}
	return basedir + directory;
}

function discoverSync (directory) {
	var filter = _.partialRight(_.endsWith, '.js');
	var mapper = _.partial(path.join, directory);
	return fs.readdirSync(directory)
		.filter(_.ary(filter, 1))
		.map(_.ary(mapper, 1));
}

function loadSync (directory) {
	return discoverSync(directory).map(function (file) {
		var noext = file.slice(0, file.length - 3);
		return {
			name: _.camelCase(noext),
			instance: require(file) 
		};
	});
}

module.exports = {
	getDefaultPathSync: getDefaultPathSync,
	discoverSync: discoverSync,
	loadSync: loadSync
};
