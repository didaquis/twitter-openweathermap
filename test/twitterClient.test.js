require('dotenv').config();
const { assert, expect } = require('chai');

const twitterClient = require('../src/lib/twitter');

describe('Testing Twitter auth', () => {

	let twClient;

	let twitter_consumer_key;
	let twitter_consumer_secret;
	let twitter_access_token_key;
	let twitter_access_token_secret;

	before((done) => {
		twClient = twitterClient;

		twitter_consumer_key = process.env.TWITTER_CONSUMER_KEY;
		twitter_consumer_secret = process.env.TWITTER_CONSUMER_SECRET;
		twitter_access_token_key = process.env.TWITTER_ACCESS_TOKEN_KEY;
		twitter_access_token_secret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

		done();
	});

	it('credentials should be defined', () => {
		expect(twClient.options.consumer_key).to.equal(twitter_consumer_key);
		expect(twClient.options.consumer_key).to.be.a('string');

		expect(twClient.options.consumer_secret).to.equal(twitter_consumer_secret);
		expect(twClient.options.consumer_secret).to.be.a('string');

		expect(twClient.options.access_token_key).to.equal(twitter_access_token_key);
		expect(twClient.options.access_token_key).to.be.a('string');

		expect(twClient.options.access_token_secret).to.equal(twitter_access_token_secret);
		expect(twClient.options.access_token_secret).to.be.a('string');
	});

	it('should be a valid object', () => {
		expect(twClient).to.be.an('object');
		assert.isObject(twClient);
	});

	it('Twitter api should have valid methods', () => {
		expect(twClient).to.have.a.property('post');
		expect(twClient).to.have.a.property('get');
	});

	it('should do a valid request', (done) => {
		twClient.get('search/tweets', {q: 'Twitter'}, function(error, tweets, response) {
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