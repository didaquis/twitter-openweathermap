const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const sinon = require('sinon');

const { typeOf, getTimeFromTimestamp, utcOffsetConversion, capitalizeText, randomValue } = require('../src/utils/utils');
const { logger } = require('../src/lib/config-log4js');

describe('typeOf', () => {
	it('should be a function', () => {
		assert.isFunction(typeOf);
	});

	it('should return a string', () => {
		assert.isString(typeOf(''));
		assert.isString(typeOf(true));
	});

	it('should return right type of parameter', () => {
		expect(typeOf(true)).to.equal('boolean');
		expect(typeOf(null)).to.equal('null');
		expect(typeOf(undefined)).to.equal('undefined');
		expect(typeOf([])).to.equal('array');
		expect(typeOf({})).to.equal('object');
		expect(typeOf(new Date())).to.equal('date');
		expect(typeOf(new Map())).to.equal('map');
		expect(typeOf(() => {})).to.equal('function');
		expect(typeOf(NaN)).to.equal('number');
		const fakeParam = 42;
		expect(typeOf(fakeParam)).to.equal('number');
	});
});

describe('getTimeFromTimestamp', () => {
	it('should be a function', () => {
		assert.isFunction(getTimeFromTimestamp);
	});

	it('should return a string', () => {
		logger.error = sinon.stub(logger, 'error');

		const firstFakeParam = 1548141113;
		const secondFakeParam = '+1';
		expect(getTimeFromTimestamp(firstFakeParam, secondFakeParam)).to.be.a('string');
		assert(logger.error.notCalled, 'logger.error should not be called');
		sinon.restore();
	});

	it('should return a valid values', () => {
		logger.error = sinon.stub(logger, 'error');

		const fakeParam = 1548141113;
		const secondFakeParam = '+1';
		const expectResult = '08:11';
		expect(getTimeFromTimestamp(fakeParam, secondFakeParam)).to.equal(expectResult);

		const anotherFakeParam = 1559279152;
		const anotherSecondFakeParam = '+2';
		const anotherExpectResult = '07:05';
		expect(getTimeFromTimestamp(anotherFakeParam, anotherSecondFakeParam)).to.equal(anotherExpectResult);

		const oneMoreFakeParam = 1969279199;
		const oneMoreSecondFakeParam = '0';
		const oneMoreExpectResult = '13:59';
		expect(getTimeFromTimestamp(oneMoreFakeParam, oneMoreSecondFakeParam)).to.equal(oneMoreExpectResult);

		const lastFakeParam = 1948534252;
		const lastSecondFakeParam = '-1';
		const lastExpectResult = '12:30';
		expect(getTimeFromTimestamp(lastFakeParam, lastSecondFakeParam)).to.equal(lastExpectResult);

		assert(logger.error.notCalled, 'logger.error should not be called');
		sinon.restore();
	});

	it('should throw an error if not receive first parameter', (done) => {
		const errorMessage = 'Invalid argument passed to getTimeFromTimestamp';
		logger.error = sinon.stub(logger, 'error').callsFake((param) => {
			assert.isString(param);
			expect(param).to.equal(errorMessage);
		});
		try {
			getTimeFromTimestamp();
		} catch (e) {
			expect(e.message).to.equal(errorMessage);
			assert(logger.error.called, 'logger.error should be called');
			sinon.restore();
			done();
		}
	});

	it('should throw an error if not receive a first valid parameter', (done) => {
		const errorMessage = 'Invalid argument passed to getTimeFromTimestamp';
		logger.error = sinon.stub(logger, 'error').callsFake((param) => {
			assert.isString(param);
			expect(param).to.equal(errorMessage);
		});
		try {
			const fakeNonValidParam = 'The cake is a lie';
			getTimeFromTimestamp(fakeNonValidParam);
		} catch (e) {
			expect(e.message).to.equal(errorMessage);
			assert(logger.error.called, 'logger.error should be called');
			sinon.restore();
			done();
		}
	});

	it('should throw an error if not receive second parameter', (done) => {
		const errorMessage = 'Invalid argument passed to getTimeFromTimestamp';
		logger.error = sinon.stub(logger, 'error').callsFake((param) => {
			assert.isString(param);
			expect(param).to.equal(errorMessage);
		});
		try {
			const fakeParam = 1548141113;
			getTimeFromTimestamp(fakeParam);
		} catch (e) {
			expect(e.message).to.equal(errorMessage);
			assert(logger.error.called, 'logger.error should be called');
			sinon.restore();
			done();
		}
	});

	it('should throw an error if not receive a second valid parameter', (done) => {
		const errorMessage = 'Invalid argument passed to getTimeFromTimestamp';
		logger.error = sinon.stub(logger, 'error').callsFake((param) => {
			assert.isString(param);
			expect(param).to.equal(errorMessage);
		});
		try {
			const fakeParam = 1548141113;
			const fakeNonValidParam = 42;
			getTimeFromTimestamp(fakeParam, fakeNonValidParam);
		} catch (e) {
			expect(e.message).to.equal(errorMessage);
			assert(logger.error.called, 'logger.error should be called');
			sinon.restore();
			done();
		}
	});
});

describe('utcOffsetConversion', () => {
	it('should be a function', () => {
		assert.isFunction(utcOffsetConversion);
	});

	it('should return an integer', () => {
		logger.error = sinon.stub(logger, 'error');

		const firstFakeParam = 1548141113;
		const secondFakeParam = '+1';
		expect(utcOffsetConversion(firstFakeParam, secondFakeParam)).to.be.a('number');
		expect(Number.isInteger(utcOffsetConversion(firstFakeParam, secondFakeParam))).to.be.true;
		assert(logger.error.notCalled, 'logger.error should not be called');
		sinon.restore();
	});

	it('should return a valid values', () => {
		logger.error = sinon.stub(logger, 'error');

		const fakeParam = 1548141113;
		const secondFakeParam = '+1';
		const expectResult = 1548144713;
		expect(utcOffsetConversion(fakeParam, secondFakeParam)).to.equal(expectResult);

		const anotherFakeParam = 1559279152;
		const anotherSecondFakeParam = '+2';
		const anotherExpectResult = 1559286352;
		expect(utcOffsetConversion(anotherFakeParam, anotherSecondFakeParam)).to.equal(anotherExpectResult);

		const oneMoreFakeParam = 1969279199;
		const oneMoreSecondFakeParam = '0';
		const oneMoreExpectResult = 1969279199;
		expect(utcOffsetConversion(oneMoreFakeParam, oneMoreSecondFakeParam)).to.equal(oneMoreExpectResult);

		const lastFakeParam = 1948534252;
		const lastSecondFakeParam = '-1';
		const lastExpectResult = 1948537852;
		expect(utcOffsetConversion(lastFakeParam, lastSecondFakeParam)).to.equal(lastExpectResult);
		assert(logger.error.notCalled, 'logger.error should not be called');
		sinon.restore();
	});

	it('should throw an error if not receive first parameter', (done) => {
		const errorMessage = 'Invalid argument passed to utcOffsetConversion';
		logger.error = sinon.stub(logger, 'error').callsFake((param) => {
			assert.isString(param);
			expect(param).to.equal(errorMessage);
		});
		try {
			utcOffsetConversion();
		} catch (e) {
			expect(e.message).to.equal(errorMessage);
			assert(logger.error.called, 'logger.error should be called');
			sinon.restore();
			done();
		}
	});

	it('should throw an error if not receive a first valid parameter', (done) => {
		const errorMessage = 'Invalid argument passed to utcOffsetConversion';
		logger.error = sinon.stub(logger, 'error').callsFake((param) => {
			assert.isString(param);
			expect(param).to.equal(errorMessage);
		});
		try {
			const fakeNonValidParam = 'The cake is a lie';
			utcOffsetConversion(fakeNonValidParam);
		} catch (e) {
			expect(e.message).to.equal(errorMessage);
			assert(logger.error.called, 'logger.error should be called');
			sinon.restore();
			done();
		}
	});

	it('should throw an error if not receive second parameter', (done) => {
		const errorMessage = 'Invalid argument passed to utcOffsetConversion';
		logger.error = sinon.stub(logger, 'error').callsFake((param) => {
			assert.isString(param);
			expect(param).to.equal(errorMessage);
		});
		try {
			const fakeParam = 1548141113;
			utcOffsetConversion(fakeParam);
		} catch (e) {
			expect(e.message).to.equal(errorMessage);
			assert(logger.error.called, 'logger.error should be called');
			sinon.restore();
			done();
		}
	});

	it('should throw an error if not receive a second valid parameter', (done) => {
		const errorMessage = 'Invalid argument passed to utcOffsetConversion';
		logger.error = sinon.stub(logger, 'error').callsFake((param) => {
			assert.isString(param);
			expect(param).to.equal(errorMessage);
		});
		try {
			const fakeParam = 1548141113;
			const fakeNonValidParam = 42;
			utcOffsetConversion(fakeParam, fakeNonValidParam);
		} catch (e) {
			expect(e.message).to.equal(errorMessage);
			assert(logger.error.called, 'logger.error should be called');
			sinon.restore();
			done();
		}
	});
});

describe('capitalizeText', () => {
	it('should be a function', () => {
		assert.isFunction(capitalizeText);
	});

	it('should return a string', () => {
		logger.error = sinon.stub(logger, 'error');

		expect(capitalizeText('foo')).to.be.a('string');

		assert(logger.error.notCalled, 'logger.error should not be called');
		sinon.restore();
	});

	it('should capitalize a string', () => {
		logger.error = sinon.stub(logger, 'error');

		const fakeParam = 'what is the meaning of life?';
		const expectedResult = 'What is the meaning of life?';
		expect(capitalizeText(fakeParam)).to.equal(expectedResult);

		const anotherFakeParam = 'the answer is 42';
		const anotherExpectedResult = 'The answer is 42';
		expect(capitalizeText(anotherFakeParam)).to.equal(anotherExpectedResult);

		const oneMoreFakeParam = 'pi';
		const oneMoreExpectedResult = 'Pi';
		expect(capitalizeText(oneMoreFakeParam)).to.equal(oneMoreExpectedResult);

		assert(logger.error.notCalled, 'logger.error should not be called');
		sinon.restore();
	});

	it('should throw an error if not receive parameter', (done) => {
		const errorMessage = 'Invalid argument passed to capitalizeText';
		logger.error = sinon.stub(logger, 'error').callsFake((param) => {
			assert.isString(param);
			expect(param).to.equal(errorMessage);
		});
		try {
			capitalizeText();
		} catch (e) {
			expect(e.message).to.equal(errorMessage);
			assert(logger.error.called, 'logger.error should be called');
			sinon.restore();
			done();
		}
	});

	it('should throw an error if receive string of 0 length as parameter', (done) => {
		const errorMessage = 'Invalid argument passed to capitalizeText';
		logger.error = sinon.stub(logger, 'error').callsFake((param) => {
			assert.isString(param);
			expect(param).to.equal(errorMessage);
		});
		try {
			capitalizeText('');
		} catch (e) {
			expect(e.message).to.equal(errorMessage);
			assert(logger.error.called, 'logger.error should be called');
			sinon.restore();
			done();
		}
	});

	it('should throw an error if not receive a valid parameter', (done) => {
		const errorMessage = 'Invalid argument passed to capitalizeText';
		logger.error = sinon.stub(logger, 'error').callsFake((param) => {
			assert.isString(param);
			expect(param).to.equal(errorMessage);
		});
		try {
			const fakeParam = 42;
			capitalizeText(fakeParam);
		} catch (e) {
			expect(e.message).to.equal(errorMessage);
			assert(logger.error.called, 'logger.error should be called');
			sinon.restore();
			done();
		}
	});
});

describe('randomValue', () => {
	it('should be a function', () => {
		assert.isFunction(randomValue);
	});

	it('should return a string', () => {
		expect(randomValue()).to.be.a('string');
	});

	it('should return a string of 32 chars', () => {
		const expectedLength = 32;
		expect(randomValue()).to.have.lengthOf(expectedLength);
	});

	it('should return a random value on every call', () => {
		let collision = false;
		let result;
		const results = [];
		const numberOfTest = 1000;
		for (let i = 0; i < numberOfTest; i++) {
			result = randomValue();
			if (results.includes(result)) {
				collision = true;
			}
			results.push(result);
		}
		expect(results).to.have.lengthOf(numberOfTest);
		expect(collision).to.be.false;
	});
});
