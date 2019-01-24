const fetch = require('node-fetch');
require('dotenv').config();

const { logger } = require('../config-log4js');

/** Class representing a request to a public OpenWeatherMap API. */
class OpenWeatherMapAPI {

	/**
	 * Create new request
	 * @param {string} baseUrl Main URL of API endpoint
	 * @param {string} lang Language of requested data
	 * @param {string} units Units of requestes data
	 */
	constructor ({ baseUrl, lang, units }) {
		this.baseUrl = baseUrl;
		this.lang = `lang=${lang}`;
		this.units = `units=${units}`;
		this.appId = `APPID=${process.env.OPENWEATHERMAP_APIKEY}`;
	}

	/**
	 * Make a request to public API
	 * @param {string} URL of endpoint
	 * @returns {Promise<Response>} Data received from endpoint
	 * @throws 						Will throw an error if status code of response is not 200
	 */
	call (url) {
		return fetch(url)
			.then(res => {
				const statusCode_OK = 200;
				if (res.status !== statusCode_OK) {
					const errorMessage = `Fetch data response: ${res.status}`;
					logger.error(errorMessage);
					throw new Error(errorMessage);
				}

				return res.json();
			});
	}

	/**
	 * Retrieve weather data
	 * @param {number} idOfCity Identification code of city
	 * @returns {Promise<Response>} Data received from endpoint
	 * @throws 						Will throw an error if the argument is not valid
	 */
	getWeatherByIdOfCity (idOfCity) {
		if (!idOfCity || !Number.isInteger(idOfCity)) {
			throw new Error('Invalid Id of city');
		}
		const urlOfRequest = `${this.baseUrl}?id=${idOfCity}&${this.appId}&${this.units}&${this.lang}`;
		return this.call(urlOfRequest);
	}
}

module.exports = OpenWeatherMapAPI;
