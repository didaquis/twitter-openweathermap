const { assert, expect } = require('chai');

const { appConfiguration } = require('../src/appConfiguration');

describe('Application configuration', () => {
	it('should be an object with valid properties', () => {
		assert.isObject(appConfiguration);

		expect(appConfiguration.hasOwnProperty('locations')).to.be.true;
		expect(appConfiguration.hasOwnProperty('publishInterval')).to.be.true;

		assert.isArray(appConfiguration.locations);

		for (const location of appConfiguration.locations) {
			assert.isObject(location);
			expect(location.hasOwnProperty('id')).to.be.true;
			expect(location.hasOwnProperty('timezone')).to.be.true;
		}
	});

	it('should have a valid values', () => {
		const regex_timezone = /[a-zA-Z]{4,24}\/[a-zA-Z_]{4,24}/;

		for (const location of appConfiguration.locations) {
			assert.isNumber(location.id);
			expect(Number.isInteger(location.id)).to.be.true;

			assert.isString(location.timezone);
			assert.match(location.timezone, regex_timezone);
		}

		assert.isNumber(appConfiguration.publishInterval);
		expect(Number.isInteger(appConfiguration.publishInterval)).to.be.true;
	});
});
