require('dotenv').config();
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const sinon = require('sinon');

const { twitterClient, publishToTwitter, formatTextToTweet, templateTextValidation } = require('../src/lib/tw');
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

describe('Twitter request', () => {
	it('should be a valid request', (done) => {
		twitterClient.get('search/tweets', {q: 'Twitter', count: 1}, function (error, tweets, response) {
			assert.isDefined(response.statusCode);
			assert.isNumber(response.statusCode);

			const statusCode_OK = 200;
			expect(response.statusCode).to.equal(statusCode_OK);

			assert.isDefined(response.statusMessage);
			assert.isString(response.statusMessage);
			expect(response.statusMessage).to.equal('OK');

			done();
		});
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

	it('should throw an error if receive invalid params', (done) => {
		try {
			const fakeParam = 42;
			publishToTwitter(fakeParam);
		} catch (e) {
			const errorMessage = 'Invalid argument passed to publishToTwitter';
			expect(e.message).to.equal(errorMessage);
			done();
		}
	});

	it('should call to twitterClient.post and this return error', (done) => {
		logger.info = sinon.spy(logger, 'info');

		logger.error = sinon.stub(logger, 'error').callsFake((param) => {
			let error = { fakeError: 'lol' };
			const errorMessage = `Trying to publish a tweet: ${JSON.stringify(error)}`;
			assert.isString(param);
			expect(param).to.equal(errorMessage);
		});

		twitterClient.post = sinon.stub(twitterClient, 'post').callsFake((endpoint, data, callback) => {
			callback();
		});

		const fakeEndpoint = 'statuses/update';
		const fakeTextToTweet = 'fake tweet';
		const callback = function () {
			let error = { fakeError: 'lol' };
			const errorMessage = `Trying to publish a tweet: ${JSON.stringify(error)}`;
			logger.error(errorMessage);
			return new Error(errorMessage);
		};

		twitterClient.post(fakeEndpoint, { status: fakeTextToTweet }, callback);

		assert(twitterClient.post.called, 'twitterClient.post is not called');
		assert(logger.error.called, 'logger.error is not called');
		assert(logger.info.notCalled, 'logger.info is called');
		sinon.restore();
		done();
	});

	it('should call to twitterClient.post and this return response.statusCode with value different than 200', (done) => {
		logger.info = sinon.spy(logger, 'info');

		logger.error = sinon.stub(logger, 'error').callsFake((param) => {
			const fakeStatusCode = 666;
			let response = { statusCode: fakeStatusCode };
			const errorMessage = `Status code of response after the attempt to publish a tweet: ${response.statusCode}`;
			assert.isString(param);
			expect(param).to.equal(errorMessage);
		});

		twitterClient.post = sinon.stub(twitterClient, 'post').callsFake((endpoint, data, callback) => {
			callback();
		});

		const fakeEndpoint = 'statuses/update';
		const fakeTextToTweet = 'fake tweet';
		const callback = function () {
			const fakeStatusCode = 666;
			let response = { statusCode: fakeStatusCode };
			const errorMessage = `Status code of response after the attempt to publish a tweet: ${response.statusCode}`;
			logger.error(errorMessage);
			return new Error(errorMessage);
		};

		twitterClient.post(fakeEndpoint, { status: fakeTextToTweet }, callback);

		assert(twitterClient.post.called, 'twitterClient.post is not called');
		assert(logger.error.called, 'logger.error is not called');
		assert(logger.info.notCalled, 'logger.info is called');
		sinon.restore();
		done();
	});

	it('should publish a tweet', (done) => {
		logger.info = sinon.stub(logger, 'info').callsFake((param) => {
			const expectedString = 'Tweet published: https://twitter.com/foo/status/7890def';
			assert.isString(param);
			expect(param).to.equal(expectedString);
		});

		twitterClient.post = sinon.stub(twitterClient, 'post').callsFake((endpoint, data, callback) => {
			callback();
		});

		const fakeEndpoint = 'statuses/update';
		const fakeTextToTweet = 'fake tweet';
		const callback = function () {
			let tweet = {
				user: {
					name: 'foo'
				},
				id_str: '7890def'
			};
			const urlOfPublishedTweet = `https://twitter.com/${tweet.user.name}/status/${tweet.id_str}`;
			logger.info(`Tweet published: ${urlOfPublishedTweet}`);
		};

		twitterClient.post(fakeEndpoint, { status: fakeTextToTweet }, callback);

		assert(twitterClient.post.called, 'twitterClient.post is not called');
		assert(logger.info.called, 'logger.info is not called');
		sinon.restore();
		done();
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
			const anotherFakeParam = '1234abc';
			formatTextToTweet(fakeParam, anotherFakeParam);
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
			const anotherFakeParam = '1234abc';
			formatTextToTweet(fakeParamWithMissingData, anotherFakeParam);
		} catch (e) {
			const errorMessage = 'Required data on formatTextToTweet not found';
			expect(e.message).to.equal(errorMessage);
			done();
		}
	});

	it('should return text well formatted', () => {
		const fakeParam = { coord: { lon: 2.02, lat: 41.57 }, weather: [ { id: 800, main: 'Clear', description: 'cielo claro', icon: '01n' } ], base: 'stations', main: { temp: 7.53, pressure: 999, humidity: 56, temp_min: 7, temp_max: 8 }, visibility: 10000, wind: { speed: 3.6, deg: 320 }, clouds: { all: 0 }, dt: 1548280800, sys: { type: 1, id: 6414, message: 0.0036, country: 'ES', sunrise: 1548227470, sunset: 1548262625 }, id: 3108286, name: 'Terrassa', cod: 200 };
		const anotherFakeParam = '1234abc';
		const fakeReturn = `
	Terrassa

	Cielo claro
	Temperatura: 7.53 ℃
	Humedad: 56 %
	Viento: 3.6 m/s
	Nubes: 0 %
	Salida del sol: 08:11
	Puesta del sol: 17:57
	-------------------------
	ID: 1234abc`;

		expect(formatTextToTweet(fakeParam, anotherFakeParam)).to.equal(fakeReturn);
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
		const fakeParams = [ {}, [], fakeValue, 'pizza', { id: 42 }, { weather: [ { id: 800, main: 'Clear', description: 'cielo claro', icon: '01n' } ]}];
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
