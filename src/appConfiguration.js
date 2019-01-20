const appConfiguration = Object.freeze({
	openWeatherMapsAPI: {
		baseUrl: 'http://api.openweathermap.org/data/2.5/weather',
		lang: 'es',
		units: 'metric',
		cities: [{id: 3108286, name: 'Terrassa'}, {id: 3128760, name: 'Barcelona'}]
	},
	publishInterval: 1200000
});

module.exports = appConfiguration;