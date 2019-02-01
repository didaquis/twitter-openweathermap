const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const sinon = require('sinon');

const { logger } = require('../src/lib/config-log4js');

describe('logger', () => {
	it('should be an object with valid methods', () => {
		assert.isObject(logger);
		assert.isFunction(logger.trace);
		assert.isFunction(logger.debug);
		assert.isFunction(logger.info);
		assert.isFunction(logger.warn);
		assert.isFunction(logger.error);
		assert.isFunction(logger.fatal);
	});

	it('should have method info and this receive a string as parameter', () => {
		const fakeParam = 'foo';

		let stub = sinon.stub(logger, 'info').callsFake((param) => {
			assert.isString(param);
			expect(param).to.equal(fakeParam);
		});

		logger.info(fakeParam);

		assert(stub.called, 'logger.info should be called');
		assert(stub.calledOnce);
		assert(stub.calledWithExactly(fakeParam));
		sinon.restore();
	});

	it('should have method error and this receive a string as parameter', () => {
		const fakeParam = 'biz';

		let stub = sinon.stub(logger, 'error').callsFake((param) => {
			assert.isString(param);
			expect(param).to.equal(fakeParam);
		});

		logger.error(fakeParam);

		assert(stub.called, 'logger.error should be called');
		assert(stub.calledOnce);
		assert(stub.calledWithExactly(fakeParam));
		sinon.restore();
	});
});
