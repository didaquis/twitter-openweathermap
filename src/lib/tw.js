const Twitter = require('twitter');

require('dotenv').config();

const { classOf, capitalizeText } = require('../utils/utils');

/**
 * Create a new instance of Twitter client class to communicate with Twitter API
 * @type {Twitter}
 */
const twitterClient = new Twitter({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
	access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

/**
 * Publish a new tweet
 * @param {string} textToTweet Text of tweet
 */
function publishToTwitter (textToTweet) {
	if (!textToTweet || typeof textToTweet !== 'string') {
		throw new Error('Invalid argument passed to publishToTwitter');
	}

	twitterClient.post('statuses/update', {status: textToTweet }, function (error, tweet, response) {
		if (error) {
			throw new Error(`Trying to publish a tweet: ${error.message}`);
		}
		const statusCode_OK = 200;
		if (response.statusCode !== statusCode_OK) {
			throw new Error(`Status code of response after try to publish a tweet: ${response.statusCode}`);
		}

		const urlOfPublishedTweet = `https://twitter.com/${tweet.user.name}/status/${tweet.id_str}`;

		console.log(`\nTweet published: \n ${urlOfPublishedTweet}`); // eslint-disable-line no-console
	});
}

/**
 * Create text of tweet using data received from OpenWeatherMAP API
 * @param  {object} data Raw data from OpenWeatherMAP API
 * @return {string]}     A templeted string with text of new tweet
 */
function formatTextToTweet (data) {
	if (!data || classOf(data) !== 'object') {
		throw new Error('Invalid argument passed to formatTextToTweet');
	}

	const firstElement = 0;

	const template = `
	El tiempo en: ${data.name}

	Temperatura actual: ${data.main.temp}
	Temperatura mínima: ${data.main.temp_min}
	Temperatura máxima: ${data.main.temp_max}
	Viento: ${data.wind.speed}
	Nubes: ${data.clouds.all}
	${capitalizeText(data.weather[firstElement].description)}`;

	return template;
}

module.exports = { twitterClient, formatTextToTweet, publishToTwitter };
