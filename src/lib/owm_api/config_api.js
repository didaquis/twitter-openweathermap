/* Home doc */
/**
 * @file Configuration settings for OpenWeatherMapAPI module
 * @see module:config_api
 */

/* Module doc */
/**
 * Configuration settings for OpenWeatherMapAPI module
 * @module config_api
 * @see module:OpenWeatherMapAPI
 */

/**
 * Configuration settings for OpenWeatherMapAPI client API
 * @type {Object}
 */
const config_api = Object.freeze({
	openWeatherMapAPI: {
		baseUrl: 'http://api.openweathermap.org/data/2.5/weather',
		lang: 'es',
		units: 'metric'
	}
});

module.exports = config_api;
