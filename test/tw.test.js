require('dotenv').config();
const { assert, expect } = require('chai');

const { twitterClient, formatTextToTweet, publishToTwitter } = require('../src/lib/tw');

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
});

describe('formatTextToTweet', () => {
	it('should be a function', () => {
		assert.isFunction(formatTextToTweet);
	});

	it('should throw an error if not receive params', (done) => {
		try {
			formatTextToTweet();
		} catch (e) {
			const errorMessage = 'Invalid argument passed to formatTextToTweet';
			expect(e.message).to.equal(errorMessage);
			done();
		}
	});

	it('should throw an error if receive invalid params', (done) => {
		try {
			const fakeParam = 42;
			formatTextToTweet(fakeParam);
		} catch (e) {
			const errorMessage = 'Invalid argument passed to formatTextToTweet';
			expect(e.message).to.equal(errorMessage);
			done();
		}
	});

	it('should return text well formatted', () => {
		const fakeParam = { coord: { lon: 2.02, lat: 41.57 }, weather: [ { id: 800, main: 'Clear', description: 'cielo claro', icon: '01n' } ], base: 'stations', main: { temp: 7.53, pressure: 999, humidity: 56, temp_min: 7, temp_max: 8 }, visibility: 10000, wind: { speed: 3.6, deg: 320 }, clouds: { all: 0 }, dt: 1548280800, sys: { type: 1, id: 6414, message: 0.0036, country: 'ES', sunrise: 1548227470, sunset: 1548262625 }, id: 3108286, name: 'Terrassa', cod: 200 };
		const fakeReturn = `
	Terrassa

	Cielo claro
	Temperatura: 7.53
	Humedad: 56 %
	Viento: 3.6 m/s
	Nubes: 0 %
	Salida del sol: 08:11
	Puesta del sol: 17:57`;
		expect(formatTextToTweet(fakeParam)).to.equal(fakeReturn);
	});
});
