const Twitter = require('twitter');

require('dotenv').config();

const { logger } = require('../lib/config-log4js');
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
 * @param {string} textToTweet 	Text of tweet
 * @throws 						Will throw an error if the argument is not valid
 * @throws 						Will throw an error if Twitter send an error
 * @throws 						Will throw an error if Twitter send a status code different then 200
 */
function publishToTwitter (textToTweet) {
	if (!textToTweet || typeof textToTweet !== 'string') {
		const errorMessage = 'Invalid argument passed to publishToTwitter';
		logger.error(errorMessage);
		throw new Error(errorMessage);
	}

	twitterClient.post('statuses/update', {status: textToTweet }, function (error, tweet, response) {
		if (error) {
			const errorMessage = `Trying to publish a tweet: ${JSON.stringify(error)}`;
			logger.error(errorMessage);
			throw new Error(errorMessage);
		}
		const statusCode_OK = 200;
		if (response.statusCode !== statusCode_OK) {
			const errorMessage = `Status code of response after the attempt to publish a tweet: ${response.statusCode}`;
			logger.error(errorMessage);
			throw new Error(errorMessage);
		}

		const urlOfPublishedTweet = `https://twitter.com/${tweet.user.name}/status/${tweet.id_str}`;

		logger.info(`Tweet published: ${urlOfPublishedTweet}`);
	});
}

/**
 * Create text of tweet using data received from OpenWeatherMAP API
 * @param  {object} data Raw data from OpenWeatherMAP API
 * @return {string}      A templeted string with text of new tweet
 * @throws 				 Will throw an error if the argument is not valid
 */
function formatTextToTweet (data) {
	if (!data || classOf(data) !== 'object') {
		const errorMessage = 'Invalid argument passed to formatTextToTweet';
		logger.error(errorMessage);
		throw new Error(errorMessage);
	}

	const firstElement = 0;

	const template = `
	El tiempo en: ${data.name}

	Temperatura media ahora: ${data.main.temp}
	Temperatura mínima ahora: ${data.main.temp_min}
	Temperatura máxima ahora: ${data.main.temp_max}
	Viento: ${data.wind.speed} m/s
	Nubes: ${data.clouds.all} %
	${capitalizeText(data.weather[firstElement].description)}`;

	return template;
}

module.exports = { twitterClient, formatTextToTweet, publishToTwitter };
