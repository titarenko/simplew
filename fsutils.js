var fs = require('fs');
var path = require('path');

function getDefaultPathSync (basedir, directory) {
	if (!directory) {
		directory = basedir;
		basedir = path.join(__dirname, '/../../');
	}
	return path.join(basedir, directory);
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
		var noext = path.basename(file, '.js');
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
