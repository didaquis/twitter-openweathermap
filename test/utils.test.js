const { assert, expect } = require('chai');

const { classOf, getTimeFromTimestamp, utcOffsetConversion, capitalizeText, randomValue } = require('../src/utils/utils');

describe('classOf', () => {
	it('should be a function', () => {
		assert.isFunction(classOf);
	});

	it('should return a string', () => {
		assert.isString(classOf(''));
		assert.isString(classOf(true));
	});

	it('should return right type of parameter', () => {
		expect(classOf(true)).to.equal('boolean');
		expect(classOf(null)).to.equal('null');
		expect(classOf(undefined)).to.equal('undefined');
		expect(classOf([])).to.equal('array');
		expect(classOf({})).to.equal('object');
		const fakeParam = 42;
		expect(classOf(fakeParam)).to.equal('number');
	});
});

describe('getTimeFromTimestamp', () => {
	it('should be a function', () => {
		assert.isFunction(getTimeFromTimestamp);
	});

	it('should return a string', () => {
		const firstFakeParam = 1548141113;
		const secondFakeParam = '+1';
		expect(getTimeFromTimestamp(firstFakeParam, secondFakeParam)).to.be.a('string');
	});

	it('should return a valid values', () => {
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
	});

	it('should throw an error if not receive first parameter', (done) => {
		try {
			getTimeFromTimestamp();
		} catch (e) {
			const errorMessage = 'Invalid argument passed to getTimeFromTimestamp';
			expect(e.message).to.equal(errorMessage);
			done();
		}
	});

	it('should throw an error if not receive a first valid parameter', (done) => {
		try {
			const fakeNonValidParam = 'The cake is a lie';
			getTimeFromTimestamp(fakeNonValidParam);
		} catch (e) {
			const errorMessage = 'Invalid argument passed to getTimeFromTimestamp';
			expect(e.message).to.equal(errorMessage);
			done();
		}
	});

	it('should throw an error if not receive second parameter', (done) => {
		try {
			const fakeParam = 1548141113;
			getTimeFromTimestamp(fakeParam);
		} catch (e) {
			const errorMessage = 'Invalid argument passed to getTimeFromTimestamp';
			expect(e.message).to.equal(errorMessage);
			done();
		}
	});

	it('should throw an error if not receive a second valid parameter', (done) => {
		try {
			const fakeParam = 1548141113;
			const fakeNonValidParam = 42;
			getTimeFromTimestamp(fakeParam, fakeNonValidParam);
		} catch (e) {
			const errorMessage = 'Invalid argument passed to getTimeFromTimestamp';
			expect(e.message).to.equal(errorMessage);
			done();
		}
	});
});

describe('utcOffsetConversion', () => {
	it('should be a function', () => {
		assert.isFunction(utcOffsetConversion);
	});

	it('should return an integer', () => {
		const firstFakeParam = 1548141113;
		const secondFakeParam = '+1';
		expect(utcOffsetConversion(firstFakeParam, secondFakeParam)).to.be.a('number');
		expect(Number.isInteger(utcOffsetConversion(firstFakeParam, secondFakeParam))).to.be.true;
	});

	it('should return a valid values', () => {
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
	});








	it('should throw an error if not receive first parameter', (done) => {
		try {
			utcOffsetConversion();
		} catch (e) {
			const errorMessage = 'Invalid argument passed to utcOffsetConversion';
			expect(e.message).to.equal(errorMessage);
			done();
		}
	});

	it('should throw an error if not receive a first valid parameter', (done) => {
		try {
			const fakeNonValidParam = 'The cake is a lie';
			utcOffsetConversion(fakeNonValidParam);
		} catch (e) {
			const errorMessage = 'Invalid argument passed to utcOffsetConversion';
			expect(e.message).to.equal(errorMessage);
			done();
		}
	});

	it('should throw an error if not receive second parameter', (done) => {
		try {
			const fakeParam = 1548141113;
			utcOffsetConversion(fakeParam);
		} catch (e) {
			const errorMessage = 'Invalid argument passed to utcOffsetConversion';
			expect(e.message).to.equal(errorMessage);
			done();
		}
	});

	it('should throw an error if not receive a second valid parameter', (done) => {
		try {
			const fakeParam = 1548141113;
			const fakeNonValidParam = 42;
			utcOffsetConversion(fakeParam, fakeNonValidParam);
		} catch (e) {
			const errorMessage = 'Invalid argument passed to utcOffsetConversion';
			expect(e.message).to.equal(errorMessage);
			done();
		}
	});
});

describe('capitalizeText', () => {
	it('should be a function', () => {
		assert.isFunction(capitalizeText);
	});

	it('should return a string', () => {
		expect(capitalizeText('foo')).to.be.a('string');
	});

	it('should capitalize a string', () => {
		const fakeParam = 'what is the meaning of life?';
		const expectedResult = 'What is the meaning of life?';
		expect(capitalizeText(fakeParam)).to.equal(expectedResult);

		const anotherFakeParam = 'the answer is 42';
		const anotherExpectedResult = 'The answer is 42';
		expect(capitalizeText(anotherFakeParam)).to.equal(anotherExpectedResult);

		const oneMoreFakeParam = 'pi';
		const oneMoreExpectedResult = 'Pi';
		expect(capitalizeText(oneMoreFakeParam)).to.equal(oneMoreExpectedResult);
	});

	it('should throw an error if not receive parameter', (done) => {
		try {
			capitalizeText();
		} catch (e) {
			const errorMessage = 'Invalid argument passed to capitalizeText';
			expect(e.message).to.equal(errorMessage);
			done();
		}
	});

	it('should throw an error if receive string of 0 length as parameter', (done) => {
		try {
			capitalizeText('');
		} catch (e) {
			const errorMessage = 'Invalid argument passed to capitalizeText';
			expect(e.message).to.equal(errorMessage);
			done();
		}
	});

	it('should throw an error if not receive a valid parameter', (done) => {
		try {
			const fakeParam = 42;
			capitalizeText(fakeParam);
		} catch (e) {
			const errorMessage = 'Invalid argument passed to capitalizeText';
			expect(e.message).to.equal(errorMessage);
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
