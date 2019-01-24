const OpenWeatherMapAPI = require('./owm_api/OpenWeatherMapAPI');

const config_api = require('./owm_api/config_api');

const { logger } = require('../lib/config-log4js');

/**
 * Request data from api and send to callback
 * @param  {Object} citiesToRetrieve Object with info about citys
 * @return {Promise}                 Object with data retrieved from API
 * @throws 							 Will throw an error if the argument is not valid
 */
async function getWeatherData (citiesToRetrieve) {
	if (!citiesToRetrieve) {
		const errorMessage = 'getWeatherData expect a valid object';
		logger.error(errorMessage);
		throw new Error(errorMessage);
	}

	const OWM_API = new OpenWeatherMapAPI(config_api.openWeatherMapAPI);

	const results = [];
	for (let city in citiesToRetrieve) {
		results.push(OWM_API.getWeatherByIdOfCity(citiesToRetrieve[city].id));
	}

	return await Promise.all(results);
}

module.exports = { getWeatherData };