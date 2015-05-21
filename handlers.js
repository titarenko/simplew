function parseRouteSync (route) {
	var parts = route.split(' ');
	switch (parts.length) {

		case 1:
			return {
				method: 'get',
				path: parts[0]
			};

		case 2:
			return {
				method: parts[0],
				path: parts[1]
			};

		default:
			throw new Error('Invalid route: ' + route);
	}
}

function handleResultSync (req, res, result) {
	switch (result && result.type) {

		case 'view':
			res.render(result.name, result.data);
			break;
		
		case 'redirect':
			res.redirect(result.url);
			break;

		case 'json':
			res.json(result.pojo);
			break;
		
		default:
			if (result === null) {
				res.status(404);
				res.render('404', { url: req.url });
			} else {
				throw new Error('Invalid result type: ' + result.type);
			}
			break;
	}
}

function handleExceptionSync (stderr, req, res, exception) {
	stderr(exception && exception.stack || exception);
	res.status(500);
	res.render('500', { url: req.url });
}

function getMethodWrapperSync (method, stderr) {
	return function methodWrapper (req, res) {
		var params = _.extend({}, req.files, req.query, req.params, req.body);
		Promise.resolve(method(params, req, res))
			.then(_.partial(handleResultSync, req, res))
			.catch(_.partial(handleExceptionSync, stderr, req, res));
	};
}

function wireControllerSync (router, stderr, controller) {
	return _.each(controller.instance, function (method, routeString) {
		var route = parseRouteSync(routeString);
		router[route.method](route.path, getMethodWrapperSync(method, stderr));
	});
}

function setupRouterSync (router, controllers, stderr) {
	_.each(controllers, _.partial(wireControllerSync, router, stderr));
}

module.exports = {
	setupRouterSync: setupRouterSync
};
