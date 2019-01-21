const OpenWeatherMapAPI = require('./owm_api/OpenWeatherMapAPI');

const config_api = require('./owm_api/config_api');

/**
 * Request data from api and send to callback
 * @param  {Object} citiesToRetrieve Object with info about citys
 * @return {Promise}                 Object with data retrieved from API
 */
async function getWeatherData(citiesToRetrieve) {
	if (!citiesToRetrieve) {
		throw new Error('Error: getWeatherData expect a valid object');
	}

	const OWM_API = new OpenWeatherMapAPI(config_api.openWeatherMapAPI);

	const results = [];
	for (let city in citiesToRetrieve) {
		results.push(OWM_API.getWeatherByIdOfCity(citiesToRetrieve[city].id));
	}

	return await Promise.all(results);
}

module.exports = getWeatherData;