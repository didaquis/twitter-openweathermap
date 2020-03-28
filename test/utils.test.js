const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const sinon = require('sinon');

const { typeOf, getTimeFromTimestamp, capitalizeText, randomValue } = require('../src/utils/utils');
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
		const secondFakeParam = 'Europe/Madrid';
		expect(getTimeFromTimestamp(firstFakeParam, secondFakeParam)).to.be.a('string');
		assert(logger.error.notCalled, 'logger.error should not be called');
		sinon.restore();
	});

	it('should return a valid values in winter time', () => {
		logger.error = sinon.stub(logger, 'error');

		const fakeParamWinterTime = 1546304461;
		const secondFakeParam = 'Europe/Madrid';
		const expectResultWinterTime = '02:01';
		expect(getTimeFromTimestamp(fakeParamWinterTime, secondFakeParam)).to.equal(expectResultWinterTime);

		assert(logger.error.notCalled, 'logger.error should not be called');
		sinon.restore();
	});

	it('should return a valid values in summer time (daylight saving time)', () => {
		logger.error = sinon.stub(logger, 'error');

		const fakeParamSummerTime = 1555007207;
		const secondFakeParam = 'Europe/Madrid';
		const expectResultSummerTime = '20:26';
		expect(getTimeFromTimestamp(fakeParamSummerTime, secondFakeParam)).to.equal(expectResultSummerTime);

		assert(logger.error.notCalled, 'logger.error should not be called');
		sinon.restore();
	});

	it('should return a valid values for the Europe/Madrid timezone', () => {
		logger.error = sinon.stub(logger, 'error');

		const fakeParam = 1548141113;
		const secondFakeParam = 'Europe/Madrid';
		const expectResult = '08:11';
		expect(getTimeFromTimestamp(fakeParam, secondFakeParam)).to.equal(expectResult);

		const anotherFakeParam = 1559279152;
		const anotherSecondFakeParam = 'Europe/Madrid';
		const anotherExpectResult = '07:05';
		expect(getTimeFromTimestamp(anotherFakeParam, anotherSecondFakeParam)).to.equal(anotherExpectResult);

		const oneMoreFakeParam = 1969279199;
		const oneMoreSecondFakeParam = 'Europe/Madrid';
		const oneMoreExpectResult = '15:59';
		expect(getTimeFromTimestamp(oneMoreFakeParam, oneMoreSecondFakeParam)).to.equal(oneMoreExpectResult);

		const lastFakeParam = 1948534252;
		const lastSecondFakeParam = 'Europe/Madrid';
		const lastExpectResult = '13:30';
		expect(getTimeFromTimestamp(lastFakeParam, lastSecondFakeParam)).to.equal(lastExpectResult);

		assert(logger.error.notCalled, 'logger.error should not be called');
		sinon.restore();
	});

	it('should return a valid values for others timezones', () => {
		logger.error = sinon.stub(logger, 'error');

		const fakeParam = 1548141113;
		const secondFakeParam = 'Atlantic/Azores';
		const nonExpectResult = '08:11';
		const expectResult = '06:11';
		expect(getTimeFromTimestamp(fakeParam, secondFakeParam)).not.to.equal(nonExpectResult);
		expect(getTimeFromTimestamp(fakeParam, secondFakeParam)).to.equal(expectResult);

		const anotherFakeParam = 1559279152;
		const anotherSecondFakeParam = 'America/Sao_Paulo';
		const anotherNonExpectResult = '07:05';
		const anotherExpectResult = '02:05';
		expect(getTimeFromTimestamp(anotherFakeParam, anotherSecondFakeParam)).not.to.equal(anotherNonExpectResult);
		expect(getTimeFromTimestamp(anotherFakeParam, anotherSecondFakeParam)).to.equal(anotherExpectResult);

		const oneMoreFakeParam = 1969279199;
		const oneMoreSecondFakeParam = 'Asia/Tokyo';
		const oneMoreNonExpectResult = '15:59';
		const oneMoreExpectResult = '22:59';
		expect(getTimeFromTimestamp(oneMoreFakeParam, oneMoreSecondFakeParam)).not.to.equal(oneMoreNonExpectResult);
		expect(getTimeFromTimestamp(oneMoreFakeParam, oneMoreSecondFakeParam)).to.equal(oneMoreExpectResult);

		const lastFakeParam = 1948534252;
		const lastSecondFakeParam = 'America/New_York';
		const lastNonExpectResult = '13:30';
		const lastExpectResult = '07:30';
		expect(getTimeFromTimestamp(lastFakeParam, lastSecondFakeParam)).not.to.equal(lastNonExpectResult);
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
			const fakeNonValidParam = null;
			getTimeFromTimestamp(fakeParam, fakeNonValidParam);
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

	it('should return a string of 20 chars', () => {
		const expectedLength = 20;
		expect(randomValue()).to.have.lengthOf(expectedLength);
	});

	it('should return a different random value on every call', () => {
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
