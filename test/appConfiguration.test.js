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
			expect(appConfig.citiesToRetrieve[city].hasOwnProperty('utc')).to.be.true;
		}
	});

	it('should have a valid values', () => {
		for (let city in appConfig.citiesToRetrieve) {
			assert.isNumber(appConfig.citiesToRetrieve[city].id);
			expect(Number.isInteger(appConfig.citiesToRetrieve[city].id)).to.be.true;
			assert.isString(appConfig.citiesToRetrieve[city].utc);
		}

		assert.isNumber(appConfig.publishInterval);
		expect(Number.isInteger(appConfig.publishInterval)).to.be.true;
	});
});
