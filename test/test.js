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
		const regex_tokenOrKey = /[A-Za-z0-9.\-_*/|]{25,}/;
		assert.match(twitter_consumer_key, regex_tokenOrKey);
		assert.match(twitter_consumer_secret, regex_tokenOrKey);
		assert.match(twitter_access_token_key, regex_tokenOrKey);
		assert.match(twitter_access_token_secret, regex_tokenOrKey);
	});

	it('should have valid format for OpenWeatherMap API', () => {
		const regex_tokenOrKey = /[A-Za-z0-9.\-_*/|]{32,}/;
		assert.match(openweathermap_apikey, regex_tokenOrKey);
	});
});

describe('Application configuration', () => {
	it('should be an object with valid properties', () => {
		assert.isObject(appConfig);

		expect(appConfig.hasOwnProperty('openWeatherMapsAPI')).to.be.true;
		expect(appConfig.hasOwnProperty('publishInterval')).to.be.true;

		expect(appConfig.openWeatherMapsAPI.hasOwnProperty('baseUrl')).to.be.true;
		expect(appConfig.openWeatherMapsAPI.hasOwnProperty('lang')).to.be.true;
		expect(appConfig.openWeatherMapsAPI.hasOwnProperty('units')).to.be.true;
		expect(appConfig.openWeatherMapsAPI.hasOwnProperty('cities')).to.be.true;

		assert.isArray(appConfig.openWeatherMapsAPI.cities);
		appConfig.openWeatherMapsAPI.cities.forEach((city) => {
			expect(city.hasOwnProperty('id')).to.be.true;
			expect(city.hasOwnProperty('name')).to.be.true;
		});
	});

	it('should have a valid values', () => {
		const regex_url = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;
		assert.match(appConfig.openWeatherMapsAPI.baseUrl, regex_url);

		const regex_lang = /[a-zA-Z]{2,10}/;
		assert.match(appConfig.openWeatherMapsAPI.lang, regex_lang);

		const regex_units = /metric/;
		assert.match(appConfig.openWeatherMapsAPI.units, regex_units);

		appConfig.openWeatherMapsAPI.cities.forEach((city) => {
			assert.isNumber(city.id);
			expect(Number.isInteger(city.id)).to.be.true;
			expect(city.name).to.be.a('string');
		});

		assert.isNumber(appConfig.publishInterval);
		expect(Number.isInteger(appConfig.publishInterval)).to.be.true;
	});
});
