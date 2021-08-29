/* Home doc */
/**
 * @file Open Weather Map functions
 * @see module:owm
 */

/* Module doc */
/**
 * Open Weather Map functions
 * @module owm
 */

const OpenWeatherMapAPI = require('./owm_api/OpenWeatherMapAPI');

const config_api = require('./owm_api/config_api');

const { logger } = require('../lib/config-log4js');

/**
 * Request data from OWM API and return a promise with all results
 * @param  {Object}  locations 	 		Object with info about one or more cities
 * @param  {integer} locations.id 		Id of city
 * @return {Promise}                 	Object with data retrieved from API
 * @throws 							 	Will throw an error if the argument is not valid
 * @function getWeatherData
 * @async
 */
async function getWeatherData (locations) {
	if (!locations) {
		const errorMessage = 'getWeatherData expect a valid object';
		logger.error(errorMessage);
		throw new Error(errorMessage);
	}

	const OWM_API = new OpenWeatherMapAPI(config_api.openWeatherMapAPI);

	const results = [];
	for (let location in locations) {
		results.push(OWM_API.getWeatherByIdOfCity(locations[location].id));
	}

	return await Promise.all(results);
}

module.exports = { getWeatherData };
