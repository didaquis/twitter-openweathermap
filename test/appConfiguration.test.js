const { assert, expect } = require('chai');

const appConfig = require('../src/appConfiguration');

describe('Application configuration', () => {
	it('should be an object with valid properties', () => {
		assert.isObject(appConfig);

		expect(appConfig.hasOwnProperty('openWeatherMapsAPI')).to.be.true;
		expect(appConfig.hasOwnProperty('citiesToRetrieve')).to.be.true;
		expect(appConfig.hasOwnProperty('publishInterval')).to.be.true;

		expect(appConfig.openWeatherMapsAPI.hasOwnProperty('baseUrl')).to.be.true;
		expect(appConfig.openWeatherMapsAPI.hasOwnProperty('lang')).to.be.true;
		expect(appConfig.openWeatherMapsAPI.hasOwnProperty('units')).to.be.true;

		assert.isArray(appConfig.citiesToRetrieve);
		appConfig.citiesToRetrieve.forEach((city) => {
			expect(city.hasOwnProperty('id')).to.be.true;
			expect(city.hasOwnProperty('name')).to.be.true;
		});
	});

	it('should have a valid values', () => {
		const regex_url = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;
		assert.match(appConfig.openWeatherMapsAPI.baseUrl, regex_url);

		const regex_lang = /[a-zA-Z]{2,10}/;
		assert.match(appConfig.openWeatherMapsAPI.lang, regex_lang);

		const regex_units = /metric/;
		assert.match(appConfig.openWeatherMapsAPI.units, regex_units);

		appConfig.citiesToRetrieve.forEach((city) => {
			assert.isNumber(city.id);
			expect(Number.isInteger(city.id)).to.be.true;
			expect(city.name).to.be.a('string');
		});

		assert.isNumber(appConfig.publishInterval);
		expect(Number.isInteger(appConfig.publishInterval)).to.be.true;
	});
});
