const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;

const config_api = require('../src/lib/owm_api/config_api');

describe('OpenWeatherMapAPI client API configuration', () => {
	it('should be an object with valid properties', () => {
		assert.isObject(config_api);

		expect(config_api.hasOwnProperty('openWeatherMapAPI')).to.be.true;
		assert.isObject(config_api.openWeatherMapAPI);

		expect(config_api.openWeatherMapAPI.hasOwnProperty('baseUrl')).to.be.true;
		expect(config_api.openWeatherMapAPI.hasOwnProperty('lang')).to.be.true;
		expect(config_api.openWeatherMapAPI.hasOwnProperty('units')).to.be.true;
	});

	it('should have a valid values', () => {
		assert.isString(config_api.openWeatherMapAPI.baseUrl);
		assert.isString(config_api.openWeatherMapAPI.lang);
		assert.isString(config_api.openWeatherMapAPI.units);

		const regex_url = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;
		assert.match(config_api.openWeatherMapAPI.baseUrl, regex_url);

		const regex_lang = /[a-zA-Z]{2,10}/;
		assert.match(config_api.openWeatherMapAPI.lang, regex_lang);

		const regex_units = /metric/;
		assert.match(config_api.openWeatherMapAPI.units, regex_units);
	});
});
