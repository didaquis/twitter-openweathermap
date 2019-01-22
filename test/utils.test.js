const { assert, expect } = require('chai');

const { classOf } = require('../src/utils/utils');

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