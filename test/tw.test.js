require('dotenv').config();
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const sinon = require('sinon');

const { publishToTwitter, formatTextToTweet, templateTextValidation } = require('../src/lib/tw');
const { logger } = require('../src/lib/config-log4js');

describe('publishToTwitter', () => {
	it('should be a function', () => {
		assert.isFunction(publishToTwitter);
	});
});

describe('formatTextToTweet', () => {
	it('should be a function', () => {
		assert.isFunction(formatTextToTweet);
	});

	it('should throw an error if not receive params', (done) => {
		try {
			formatTextToTweet();
		} catch (e) {
			const errorMessage = 'Invalid arguments passed to formatTextToTweet';
			expect(e.message).to.equal(errorMessage);
			done();
		}
	});

	it('should throw an error if receive invalid params', (done) => {
		try {
			const fakeParam = 42;
			const fakeRandomValue = '34f7eba5a38d60c2db4c';
			formatTextToTweet(fakeParam, fakeRandomValue);
		} catch (e) {
			const errorMessage = 'Invalid arguments passed to formatTextToTweet';
			expect(e.message).to.equal(errorMessage);
			done();
		}
	});

	it('should throw an error if only receive first params', (done) => {
		try {
			const fakeParam = { coord: { lon: 2.02, lat: 41.57 }, weather: [ { id: 800, main: 'Clear', description: 'cielo claro', icon: '01n' } ], base: 'stations', main: { temp: 7.53, pressure: 999, humidity: 56, temp_min: 7, temp_max: 8 }, visibility: 10000, wind: { speed: 3.6, deg: 320 }, clouds: { all: 0 }, dt: 1548280800, sys: { type: 1, id: 6414, message: 0.0036, country: 'ES', sunrise: 1548227470, sunset: 1548262625 }, id: 3108286, name: 'Terrassa', cod: 200 };
			formatTextToTweet(fakeParam);
		} catch (e) {
			const errorMessage = 'Invalid arguments passed to formatTextToTweet';
			expect(e.message).to.equal(errorMessage);
			done();
		}
	});

	it('should throw an error if not receive required data', (done) => {
		try {
			const fakeParamWithMissingData = { coord: { lon: 2.02, lat: 41.57 }, weather: [ { id: 800, main: 'Clear', description: 'cielo claro', icon: '01n' } ], base: 'stations', visibility: 10000, wind: { speed: 3.6, deg: 320 }, clouds: { all: 0 }, dt: 1548280800, id: 3108286, cod: 200 };
			const anotherFakeParam = '34f7eba5a38d60c2db4c';
			formatTextToTweet(fakeParamWithMissingData, anotherFakeParam);
		} catch (e) {
			const errorMessage = 'Required data on formatTextToTweet not found';
			expect(e.message).to.equal(errorMessage);
			done();
		}
	});

	it('should return text well formatted', () => {
		const fakeParam = { coord: { lon: 2.02, lat: 41.57 }, weather: [ { id: 800, main: 'Clear', description: 'cielo claro', icon: '01n' } ], base: 'stations', main: { temp: 7.53, pressure: 999, humidity: 56, temp_min: 7, temp_max: 8 }, visibility: 10000, wind: { speed: 3.6, deg: 320 }, clouds: { all: 0 }, dt: 1548280800, sys: { type: 1, id: 6414, message: 0.0036, country: 'ES', sunrise: 1548227470, sunset: 1548262625 }, id: 3125442, name: 'Centelles', cod: 200 };
		const fakeRandomValue = '34f7eba5a38d60c2db4c';
		const fakeReturn = `
	Centelles

	Cielo claro
	Temperatura: 7.53 ℃
	Humedad: 56 %
	Viento: 3.6 m/s
	Nubes: 0 %
	Salida del sol: 08:11
	Puesta del sol: 17:57
	-------------------------
	ID: 34f7eba5a38d60c2db4c`;

		expect(formatTextToTweet(fakeParam, fakeRandomValue)).to.equal(fakeReturn);
	});
});

describe('templateTextValidation', () => {
	it('should be a function', () => {
		assert.isFunction(templateTextValidation);
	});

	it('should return false if not receive params', () => {
		assert.isFalse(templateTextValidation());
	});

	it('should return false if not receive valid params', () => {
		const fakeValue = 42;
		const fakeParams = [ {}, [], fakeValue, 'pizza', { id: 42 }, { weather: [ { id: 800, main: 'Clear', description: 'cielo claro', icon: '01n' } ] }];
		const fakeParamsWithMissingData = [
			{ coord: { lon: 2.02, lat: 41.57 }, weather: [ { id: 800, main: 'Clear', description: 'cielo claro', icon: '01n' } ], base: 'stations', main: { temp: 7.53, pressure: 999, humidity: 56, temp_min: 7, temp_max: 8 }, visibility: 10000, wind: { speed: 3.6, deg: 320 }, clouds: { all: 0 }, dt: 1548280800, sys: { type: 1, id: 6414, message: 0.0036, country: 'ES', sunrise: 1548227470, sunset: 1548262625 }, id: 3108286, cod: 200 },
			{ coord: { lon: 2.02, lat: 41.57 }, weather: [ { id: 800, main: 'Clear', description: 'cielo claro', icon: '01n' } ], base: 'stations', main: { temp: 7.53, pressure: 999, humidity: 56, temp_min: 7, temp_max: 8 }, visibility: 10000, wind: { speed: 3.6, deg: 320 }, clouds: { all: 0 }, dt: 1548280800, sys: { type: 1, id: 6414, message: 0.0036, country: 'ES', sunset: 1548262625 }, id: 3108286, name: 'Terrassa', cod: 200 },
			{ coord: { lon: 2.02, lat: 41.57 }, weather: [ { id: 800, main: 'Clear', description: 'cielo claro', icon: '01n' } ], base: 'stations', main: { temp: 7.53, pressure: 999, humidity: 56, temp_min: 7, temp_max: 8 }, visibility: 10000, wind: { speed: 3.6, deg: 320 }, clouds: { all: 0 }, dt: 1548280800, sys: { type: 1, id: 6414, message: 0.0036, country: 'ES', sunrise: 1548227470 }, id: 3108286, name: 'Terrassa', cod: 200 },
			{ coord: { lon: 2.02, lat: 41.57 }, weather: [ { id: 800, main: 'Clear', icon: '01n' } ], base: 'stations', main: { temp: 7.53, pressure: 999, humidity: 56, temp_min: 7, temp_max: 8 }, visibility: 10000, wind: { speed: 3.6, deg: 320 }, clouds: { all: 0 }, dt: 1548280800, sys: { type: 1, id: 6414, message: 0.0036, country: 'ES', sunrise: 1548227470, sunset: 1548262625 }, id: 3108286, name: 'Terrassa', cod: 200 },
			{ coord: { lon: 2.02, lat: 41.57 }, weather: [ { id: 800, main: 'Clear', description: 'cielo claro', icon: '01n' } ], base: 'stations', main: { temp: 7.53, pressure: 999, temp_min: 7, temp_max: 8 }, visibility: 10000, wind: { speed: 3.6, deg: 320 }, clouds: { all: 0 }, dt: 1548280800, sys: { type: 1, id: 6414, message: 0.0036, country: 'ES', sunrise: 1548227470, sunset: 1548262625 }, id: 3108286, name: 'Terrassa', cod: 200 },
			{ coord: { lon: 2.02, lat: 41.57 }, weather: [ { id: 800, main: 'Clear', description: 'cielo claro', icon: '01n' } ], base: 'stations', main: { pressure: 999, humidity: 56, temp_min: 7, temp_max: 8 }, visibility: 10000, wind: { speed: 3.6, deg: 320 }, clouds: { all: 0 }, dt: 1548280800, sys: { type: 1, id: 6414, message: 0.0036, country: 'ES', sunrise: 1548227470, sunset: 1548262625 }, id: 3108286, name: 'Terrassa', cod: 200 },
			{ coord: { lon: 2.02, lat: 41.57 }, weather: [ { id: 800, main: 'Clear', description: 'cielo claro', icon: '01n' } ], base: 'stations', main: { temp: 7.53, pressure: 999, humidity: 56, temp_min: 7, temp_max: 8 }, visibility: 10000, wind: { deg: 320 }, clouds: { all: 0 }, dt: 1548280800, sys: { type: 1, id: 6414, message: 0.0036, country: 'ES', sunrise: 1548227470, sunset: 1548262625 }, id: 3108286, name: 'Terrassa', cod: 200 },
			{ coord: { lon: 2.02, lat: 41.57 }, base: 'stations', main: { temp: 7.53, pressure: 999, humidity: 56, temp_min: 7, temp_max: 8 }, visibility: 10000, wind: { speed: 3.6, deg: 320 }, clouds: { all: 0 }, dt: 1548280800, sys: { type: 1, id: 6414, message: 0.0036, country: 'ES', sunrise: 1548227470, sunset: 1548262625 }, id: 3108286, name: 'Terrassa', cod: 200 },
			{ coord: { lon: 2.02, lat: 41.57 }, weather: [ { id: 800, main: 'Clear', description: 'cielo claro', icon: '01n' } ], base: 'stations', main: { temp: 7.53, pressure: 999, humidity: 56, temp_min: 7, temp_max: 8 }, visibility: 10000, wind: { speed: 3.6, deg: 320 }, clouds: 0, dt: 1548280800, sys: { type: 1, id: 6414, message: 0.0036, country: 'ES', sunrise: 1548227470, sunset: 1548262625 }, id: 3108286, name: 'Terrassa', cod: 200 }
		];

		fakeParams.forEach((fakeParam) => {
			assert.isFalse(templateTextValidation(fakeParam));
		});

		fakeParamsWithMissingData.forEach((fakeParam) => {
			assert.isFalse(templateTextValidation(fakeParam));
		});
	});

	it('should return true if receive valid params', () => {
		const fakeParam = { coord: { lon: 2.02, lat: 41.57 }, weather: [ { id: 800, main: 'Clear', description: 'cielo claro', icon: '01n' } ], base: 'stations', main: { temp: 7.53, pressure: 999, humidity: 56, temp_min: 7, temp_max: 8 }, visibility: 10000, wind: { speed: 3.6, deg: 320 }, clouds: { all: 0 }, dt: 1548280800, sys: { type: 1, id: 6414, message: 0.0036, country: 'ES', sunrise: 1548227470, sunset: 1548262625 }, id: 3108286, name: 'Terrassa', cod: 200 };

		assert.isTrue(templateTextValidation(fakeParam));
	});
});
