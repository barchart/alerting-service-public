module.exports = function(api) {
	api.cache(true);

	return {
		presets: ['module:metro-react-native-babel-preset'],
		plugins: [
			[
				'babel-plugin-rewrite-require',
				{
					aliases: {}
				}
			]
		],
		env: {
			production: {
				plugins: ['react-native-paper/babel']
			}
		}
	};
};
