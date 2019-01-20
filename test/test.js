require('dotenv').config();
const { assert, expect } = require('chai');

const appConfig = require('../src/appConfiguration');

describe('Enviroment vars', () => {

	let twitter_consumer_key;
	let twitter_consumer_secret;
	let twitter_access_token_key;
	let twitter_access_token_secret;
	let openweathermap_apikey;

	before('Reading the enviroment vars', () => {
		twitter_consumer_key = process.env.TWITTER_CONSUMER_KEY;
		twitter_consumer_secret = process.env.TWITTER_CONSUMER_SECRET;
		twitter_access_token_key = process.env.TWITTER_ACCESS_TOKEN_KEY;
		twitter_access_token_secret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

		openweathermap_apikey = process.env.OPENWEATHERMAP_APIKEY;
	});

	it('should be setted for Twitter API', () => {
		expect(twitter_consumer_key).not.to.be.undefined;
		expect(twitter_consumer_secret).not.to.be.undefined;
		expect(twitter_access_token_key).not.to.be.undefined;
		expect(twitter_access_token_secret).not.to.be.undefined;
	});

	it('should be setted for OpenWeatherMap API', () => {
		expect(openweathermap_apikey).not.to.be.undefined;
	});

	it('should have valid format for Twitter API', () => {
		const regularExpression = /[A-Za-z0-9.\-_*/|]{25,}/;
		assert.match(twitter_consumer_key, regularExpression);
		assert.match(twitter_consumer_secret, regularExpression);
		assert.match(twitter_access_token_key, regularExpression);
		assert.match(twitter_access_token_secret, regularExpression);
	});

	it('should have valid format for OpenWeatherMap API', () => {
		const regularExpression = /[A-Za-z0-9.\-_*/|]{32,}/;
		assert.match(openweathermap_apikey, regularExpression);
	});
});

describe('Application configuration', () => {
	it('should be a valid object', () => {
		assert.isObject(appConfig);
	});
});
