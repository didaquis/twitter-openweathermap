require('dotenv').config();
const { assert, expect } = require('chai');

const twitterClient = require('../src/lib/twitter');

describe('Testing Twitter auth', () => {

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

	it('credentials should be defined', () => {
		expect(twitterClient.options.consumer_key).to.equal(twitter_consumer_key);
		expect(twitterClient.options.consumer_key).to.be.a('string');

		expect(twitterClient.options.consumer_secret).to.equal(twitter_consumer_secret);
		expect(twitterClient.options.consumer_secret).to.be.a('string');

		expect(twitterClient.options.access_token_key).to.equal(twitter_access_token_key);
		expect(twitterClient.options.access_token_key).to.be.a('string');

		expect(twitterClient.options.access_token_secret).to.equal(twitter_access_token_secret);
		expect(twitterClient.options.access_token_secret).to.be.a('string');
	});

	it('should be a valid object', () => {
		expect(twitterClient).to.be.an('object');
		assert.isObject(twitterClient);
	});

	it('Twitter api should have valid methods', () => {
		expect(twitterClient).to.have.a.property('post');
		expect(twitterClient).to.have.a.property('get');
	});

	it('should do a valid request', (done) => {
		twitterClient.get('search/tweets', {q: 'Twitter'}, function(error, tweets, response) {
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
