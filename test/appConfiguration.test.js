const { assert, expect } = require('chai');

const appConfig = require('../src/appConfiguration');

describe('Application configuration', () => {
	it('should be an object with valid properties', () => {
		assert.isObject(appConfig);

		expect(appConfig.hasOwnProperty('citiesToRetrieve')).to.be.true;
		expect(appConfig.hasOwnProperty('publishInterval')).to.be.true;

		assert.isObject(appConfig.citiesToRetrieve);

		for (let city in appConfig.citiesToRetrieve) {
			assert.isObject(appConfig.citiesToRetrieve[city]);
			expect(appConfig.citiesToRetrieve[city].hasOwnProperty('id')).to.be.true;
			expect(appConfig.citiesToRetrieve[city].hasOwnProperty('timezone')).to.be.true;
		}
	});

	it('should have a valid values', () => {
		const regex_timezone = /[a-zA-Z]{4,24}\/[a-zA-Z_]{4,24}/;

		for (let city in appConfig.citiesToRetrieve) {
			assert.isNumber(appConfig.citiesToRetrieve[city].id);
			expect(Number.isInteger(appConfig.citiesToRetrieve[city].id)).to.be.true;

			assert.isString(appConfig.citiesToRetrieve[city].timezone);
			assert.match(appConfig.citiesToRetrieve[city].timezone, regex_timezone);
		}

		assert.isNumber(appConfig.publishInterval);
		expect(Number.isInteger(appConfig.publishInterval)).to.be.true;
	});
});
