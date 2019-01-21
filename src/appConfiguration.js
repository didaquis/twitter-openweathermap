const appConfiguration = Object.freeze({
	openWeatherMapAPI: {
		baseUrl: 'http://api.openweathermap.org/data/2.5/weather',
		lang: 'es',
		units: 'metric'
	},
	citiesToRetrieve: {
		terrassa: {
			id: 3108286
		},
		barcelona: {
			id: 3128760
		}
	},
	publishInterval: 1200000
});

module.exports = appConfiguration;