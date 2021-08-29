const { assert, expect } = require('chai');

const { appConfiguration } = require('../src/appConfiguration');

describe('Application configuration', () => {
	it('should be an object with valid properties', () => {
		assert.isObject(appConfiguration);

		expect(appConfiguration.hasOwnProperty('citiesToRetrieve')).to.be.true;
		expect(appConfiguration.hasOwnProperty('publishInterval')).to.be.true;

		assert.isObject(appConfiguration.citiesToRetrieve);

		for (let city in appConfiguration.citiesToRetrieve) {
			assert.isObject(appConfiguration.citiesToRetrieve[city]);
			expect(appConfiguration.citiesToRetrieve[city].hasOwnProperty('id')).to.be.true;
			expect(appConfiguration.citiesToRetrieve[city].hasOwnProperty('timezone')).to.be.true;
		}
	});

	it('should have a valid values', () => {
		const regex_timezone = /[a-zA-Z]{4,24}\/[a-zA-Z_]{4,24}/;

		for (let city in appConfiguration.citiesToRetrieve) {
			assert.isNumber(appConfiguration.citiesToRetrieve[city].id);
			expect(Number.isInteger(appConfiguration.citiesToRetrieve[city].id)).to.be.true;

			assert.isString(appConfiguration.citiesToRetrieve[city].timezone);
			assert.match(appConfiguration.citiesToRetrieve[city].timezone, regex_timezone);
		}

		assert.isNumber(appConfiguration.publishInterval);
		expect(Number.isInteger(appConfiguration.publishInterval)).to.be.true;
	});
});
