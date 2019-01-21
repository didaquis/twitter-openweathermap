const { assert, expect } = require('chai');

const appConfig = require('../src/appConfiguration');

describe('Application configuration', () => {
	it('should be an object with valid properties', () => {
		assert.isObject(appConfig);

		expect(appConfig.hasOwnProperty('openWeatherMapAPI')).to.be.true;
		expect(appConfig.hasOwnProperty('citiesToRetrieve')).to.be.true;
		expect(appConfig.hasOwnProperty('publishInterval')).to.be.true;

		expect(appConfig.openWeatherMapAPI.hasOwnProperty('baseUrl')).to.be.true;
		expect(appConfig.openWeatherMapAPI.hasOwnProperty('lang')).to.be.true;
		expect(appConfig.openWeatherMapAPI.hasOwnProperty('units')).to.be.true;

		assert.isObject(appConfig.citiesToRetrieve);

		for (let city in appConfig.citiesToRetrieve) {
			assert.isObject(appConfig.citiesToRetrieve[city]);
			expect(appConfig.citiesToRetrieve[city].hasOwnProperty('id')).to.be.true;
		}
	});

	it('should have a valid values', () => {
		const regex_url = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;
		assert.match(appConfig.openWeatherMapAPI.baseUrl, regex_url);

		const regex_lang = /[a-zA-Z]{2,10}/;
		assert.match(appConfig.openWeatherMapAPI.lang, regex_lang);

		const regex_units = /metric/;
		assert.match(appConfig.openWeatherMapAPI.units, regex_units);

		for (let city in appConfig.citiesToRetrieve) {
			assert.isNumber(appConfig.citiesToRetrieve[city].id);
			expect(Number.isInteger(appConfig.citiesToRetrieve[city].id)).to.be.true;
		}

		assert.isNumber(appConfig.publishInterval);
		expect(Number.isInteger(appConfig.publishInterval)).to.be.true;
	});
});
