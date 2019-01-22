const { assert, expect } = require('chai');

const getWeatherData = require('../src/lib/owm');
const appConfig = require('../src/appConfiguration');

describe('owm getWeatherData', () => {
	it('should be a function', () => {
		assert.isFunction(getWeatherData);
	});

	it('should throw an error if no receive params', (done) => {
		getWeatherData().then().catch((e) => {
			const errorMessage = 'getWeatherData expect a valid object';
			expect(e.message).to.equal(errorMessage);
			done();
		});
	});

	it('should return data', (done) => {
		getWeatherData(appConfig.citiesToRetrieve)
			.then((data) => {
				expect(data).not.to.be.undefined;
				assert.isArray(data);

				data.forEach((d) => {
					assert.isObject(d);
				});
				done();
			})
			.catch();
	});
});