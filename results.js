module.exports = {
	view: function (name, data) {
		return {
			type: 'view',
			name: name,
			data: data
		};
	},
	redirect: function (url) {
		return {
			type: 'redirect',
			url: url
		};
	},
	json: function (pojo) {
		return {
			type: 'json',
			pojo: pojo
		};
	}
};
