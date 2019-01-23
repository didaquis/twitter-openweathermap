const { assert, expect } = require('chai');

const { classOf, getTimeFromTimestamp, capitalizeText } = require('../src/utils/utils');

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
		const fakeParam = 1548141113;
		expect(getTimeFromTimestamp(fakeParam)).to.be.a('string');
	});

	it('should return a valid values', () => {
		const fakeParam = 1548141113;
		const expectResult = '23:02';
		expect(getTimeFromTimestamp(fakeParam)).to.equal(expectResult);

		const anotherFakeParam = 1559279152;
		const anotherExpectResult = '02:07';
		expect(getTimeFromTimestamp(anotherFakeParam)).to.equal(anotherExpectResult);

		const OneMoreFakeParam = 1969279199;
		const OneMoreExpectResult = '20:01';
		expect(getTimeFromTimestamp(OneMoreFakeParam)).to.equal(OneMoreExpectResult);

		const lastFakeParam = 1948534252;
		const lastExpectResult = '14:15';
		expect(getTimeFromTimestamp(lastFakeParam)).to.equal(lastExpectResult);
	});

	it('should throw an error if not receive parameter', (done) => {
		try {
			getTimeFromTimestamp();
		} catch (e) {
			const errorMessage = 'Invalid argument to getTimeFromTimestamp';
			expect(e.message).to.equal(errorMessage);
			done();
		}
	});

	it('should throw an error if not receive a valid parameter', (done) => {
		try {
			getTimeFromTimestamp('The cake is a lie');
		} catch (e) {
			const errorMessage = 'Invalid argument to getTimeFromTimestamp';
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
			const errorMessage = 'Invalid argument to capitalizeText';
			expect(e.message).to.equal(errorMessage);
			done();
		}
	});

	it('should throw an error if receive string of 0 length as parameter', (done) => {
		try {
			capitalizeText('');
		} catch (e) {
			const errorMessage = 'Invalid argument to capitalizeText';
			expect(e.message).to.equal(errorMessage);
			done();
		}
	});

	it('should throw an error if not receive a valid parameter', (done) => {
		try {
			const fakeParam = 42;
			capitalizeText(fakeParam);
		} catch (e) {
			const errorMessage = 'Invalid argument to capitalizeText';
			expect(e.message).to.equal(errorMessage);
			done();
		}
	});
});

