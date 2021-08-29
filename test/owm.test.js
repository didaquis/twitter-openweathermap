const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const sinon = require('sinon');

const { getWeatherData } = require('../src/lib/owm');
const { logger } = require('../src/lib/config-log4js');

describe('owm getWeatherData', () => {
	it('should be a function', () => {
		assert.isFunction(getWeatherData);
	});

	it('should throw an error if no receive params', (done) => {
		const expectedError = 'getWeatherData expect a valid object';
		logger.error = sinon.stub(logger, 'error').callsFake((param) => {
			assert.isString(param);
			expect(param).to.equal(expectedError);
		});

		getWeatherData().then().catch((e) => {
			const errorMessage = 'getWeatherData expect a valid object';
			expect(e.message).to.equal(errorMessage);
			assert(logger.error.called, 'logger.error should be called');
			sinon.restore();
			done();
		});
	});
});