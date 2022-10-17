require('dotenv').config();
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const sinon = require('sinon');

const { twitterClient, publishToTwitter, manageTwitterResponse, formatTextToTweet, templateTextValidation } = require('../src/lib/tw');
const { logger } = require('../src/lib/config-log4js');

describe('Twitter auth', () => {

	let twitter_consumer_key;
	let twitter_consumer_secret;
	let twitter_access_token_key;
	let twitter_access_token_secret;

	before( () => {
		twitter_consumer_key = process.env.TWITTER_CONSUMER_KEY;
		twitter_consumer_secret = process.env.TWITTER_CONSUMER_SECRET;
		twitter_access_token_key = process.env.TWITTER_ACCESS_TOKEN_KEY;
		twitter_access_token_secret = process.env.TWITTER_ACCESS_TOKEN_SECRET;
	});

	it('credentials should be defined on the instance', () => {
		expect(twitterClient.options.consumer_key).to.equal(twitter_consumer_key);
		expect(twitterClient.options.consumer_key).to.be.a('string');

		expect(twitterClient.options.consumer_secret).to.equal(twitter_consumer_secret);
		expect(twitterClient.options.consumer_secret).to.be.a('string');

		expect(twitterClient.options.access_token_key).to.equal(twitter_access_token_key);
		expect(twitterClient.options.access_token_key).to.be.a('string');

		expect(twitterClient.options.access_token_secret).to.equal(twitter_access_token_secret);
		expect(twitterClient.options.access_token_secret).to.be.a('string');
	});

	it('instance client should be a valid object', () => {
		expect(twitterClient).to.be.an('object');
		assert.isObject(twitterClient);
	});

	it('instance client should have valid methods', () => {
		expect(twitterClient).to.have.a.property('post');
		expect(twitterClient).to.have.a.property('get');
	});
});

describe('publishToTwitter', () => {
	it('should be a function', () => {
		assert.isFunction(publishToTwitter);
	});

	it('should throw an error if not receive params', (done) => {
		try {
			publishToTwitter();
		} catch (e) {
			const errorMessage = 'Invalid argument passed to publishToTwitter';
			expect(e.message).to.equal(errorMessage);
			done();
		}
	});

	it('should throw an error if receive only on param', (done) => {
		try {
			const fakeParam = 'fake-string';
			publishToTwitter(fakeParam);
		} catch (e) {
			const errorMessage = 'Invalid argument passed to publishToTwitter';
			expect(e.message).to.equal(errorMessage);
			done();
		}
	});

	it('should throw an error if receive invalid params', (done) => {
		try {
			const fakeParam = 42;
			const anotherFakeParam = 42;
			publishToTwitter(fakeParam, anotherFakeParam);
		} catch (e) {
			const errorMessage = 'Invalid argument passed to publishToTwitter';
			expect(e.message).to.equal(errorMessage);
			done();
		}
	});

	it('should throw an error if not receive callback parameter', (done) => {
		try {
			const fakeParam = 'fake-text';
			const anotherFakeParam = 42;
			publishToTwitter(fakeParam, anotherFakeParam);
		} catch (e) {
			const errorMessage = 'Invalid argument passed to publishToTwitter';
			expect(e.message).to.equal(errorMessage);
			done();
		}
	});

	it('should call to twitterClient.post and this return error', (done) => {
		logger.info = sinon.spy(logger, 'info');

		logger.error = sinon.stub(logger, 'error').callsFake((param) => {
			const error = { fakeError: 'whatever...' };
			const errorMessage = `Trying to publish a tweet: ${JSON.stringify(error)}`;
			assert.isString(param);
			expect(param).to.equal(errorMessage);
		});

		twitterClient.post = sinon.stub(twitterClient, 'post').callsFake((endpoint, data, callback) => {
			const expectedEndoint = 'statuses/update';
			const expectedData = { status: 'fake tweet' };

			expect(endpoint).to.equal(expectedEndoint);
			expect(data).to.deep.equal(expectedData);

			const error = { fakeError: 'whatever...' };
			const tweet = {};
			const response = {};
			callback(error, tweet, response);
		});

		const fakeEndpoint = 'statuses/update';
		const fakeTextToTweet = 'fake tweet';
		twitterClient.post(fakeEndpoint, { status: fakeTextToTweet }, manageTwitterResponse);

		assert(twitterClient.post.called, 'twitterClient.post should be called');
		assert(logger.error.called, 'logger.error should be called');
		assert(logger.info.notCalled, 'logger.info should not be called');
		sinon.restore();
		done();
	});

	it('should call to twitterClient.post and this return response.statusCode with value different than 200', (done) => {
		logger.info = sinon.spy(logger, 'info');

		logger.error = sinon.stub(logger, 'error').callsFake((param) => {
			const response = { statusCode: 777 };
			const errorMessage = `Status code of response after the attempt to publish a tweet: ${response.statusCode}`;
			assert.isString(param);
			expect(param).to.equal(errorMessage);
		});

		twitterClient.post = sinon.stub(twitterClient, 'post').callsFake((endpoint, data, callback) => {
			const expectedEndoint = 'statuses/update';
			const expectedData = { status: 'fake tweet' };

			expect(endpoint).to.equal(expectedEndoint);
			expect(data).to.deep.equal(expectedData);

			const error = null;
			const tweet = {};
			const response = { statusCode: 777 };
			callback(error, tweet, response);
		});

		const fakeEndpoint = 'statuses/update';
		const fakeTextToTweet = 'fake tweet';
		twitterClient.post(fakeEndpoint, { status: fakeTextToTweet }, manageTwitterResponse);

		assert(twitterClient.post.called, 'twitterClient.post should be called');
		assert(logger.error.called, 'logger.error should be called');
		assert(logger.info.notCalled, 'logger.info should not be called');
		sinon.restore();
		done();
	});

	it('should publish a tweet', (done) => {
		logger.info = sinon.stub(logger, 'info').callsFake((param) => {
			const expectedString = 'Tweet published: https://twitter.com/foo/status/7890def';
			assert.isString(param);
			expect(param).to.equal(expectedString);
		});

		let spy = sinon.spy(manageTwitterResponse);

		twitterClient.post = sinon.stub(twitterClient, 'post').callsFake((endpoint, data, callback) => {
			const expectedEndoint = 'statuses/update';
			const expectedData = { status: 'fake tweet' };

			expect(endpoint).to.equal(expectedEndoint);
			expect(data).to.deep.equal(expectedData);

			const error = null;
			const tweet = {
				user: {
					name: 'foo'
				},
				id_str: '7890def'
			};
			const response = { statusCode: 200 };
			callback(error, tweet, response);
		});

		const fakeEndpoint = 'statuses/update';
		const fakeTextToTweet = 'fake tweet';
		twitterClient.post(fakeEndpoint, { status: fakeTextToTweet }, spy);

		assert(twitterClient.post.called, 'twitterClient.post should be called');
		assert(logger.info.called, 'logger.info should be called');

		assert(spy.called, 'manageTwitterResponse should be called');
		sinon.restore();
		done();
	});
});

describe('manageTwitterResponse', () => {
	it('should return error if first param is not null', () => {
		logger.info = sinon.spy(logger, 'info');

		logger.error = sinon.stub(logger, 'error').callsFake((param) => {
			const error = 'fake-error';
			const errorMessage = `Trying to publish a tweet: ${JSON.stringify(error)}`;
			assert.isString(param);
			expect(param).to.equal(errorMessage);
		});

		const error = 'fake-error';
		const tweet = {};
		const response = { statusCode: 777 };

		expect(manageTwitterResponse(error, tweet, response) instanceof Error).to.be.true;

		assert(logger.error.called, 'logger.error should be called');
		assert(logger.info.notCalled, 'logger.info should not be called');
		sinon.restore();
	});

	it('should return error if third param have statusCode property value different than 200', () => {
		logger.info = sinon.spy(logger, 'info');

		logger.error = sinon.stub(logger, 'error').callsFake((param) => {
			const response = { statusCode: 777 };
			const errorMessage = `Status code of response after the attempt to publish a tweet: ${response.statusCode}`;
			assert.isString(param);
			expect(param).to.equal(errorMessage);
		});

		const error = null;
		const tweet = {
			user: {
				name: 'foo'
			},
			id_str: '7890def'
		};
		const response = { statusCode: 777 };

		expect(manageTwitterResponse(error, tweet, response) instanceof Error).to.be.true;

		assert(logger.error.called, 'logger.error should be called');
		assert(logger.info.notCalled, 'logger.info should not be called');
		sinon.restore();
	});

	it('shoud not return error (and call to logger.info) if first param is null and third param have statusCode property with value of 200', () => {
		logger.info = sinon.stub(logger, 'info').callsFake((param) => {
			const expectedString = 'Tweet published: https://twitter.com/foo/status/7890def';
			assert.isString(param);
			expect(param).to.equal(expectedString);
		});

		const error = null;
		const tweet = {
			user: {
				name: 'foo'
			},
			id_str: '7890def'
		};
		const response = { statusCode: 200 };
		manageTwitterResponse(error, tweet, response);
		assert(logger.info.called, 'logger.info should be called');
		sinon.restore();
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
