const Twitter = require('twitter');

require('dotenv').config();

const { logger } = require('../lib/config-log4js');
const { classOf, capitalizeText, getTimeFromTimestamp } = require('../utils/utils');
const appConfig = require('../appConfiguration');

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
		throw new Error(errorMessage);
	}

	twitterClient.post('statuses/update', {status: textToTweet }, function (error, tweet, response) {
		if (error) {
			const errorMessage = `Trying to publish a tweet: ${JSON.stringify(error)}`;
			logger.error(errorMessage);
			return new Error(errorMessage);
		}
		const statusCode_OK = 200;
		if (response.statusCode !== statusCode_OK) {
			const errorMessage = `Status code of response after the attempt to publish a tweet: ${response.statusCode}`;
			logger.error(errorMessage);
			return new Error(errorMessage);
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
		throw new Error(errorMessage);
	}

	if (!templateTextValidation (data)) {
		const errorMessage = 'Required data on formatTextToTweet not found';
		throw new Error(errorMessage);
	}

	const firstElement = 0;
	const template = `
	${data.name}

	${capitalizeText(data.weather[firstElement].description)}
	Temperatura: ${data.main.temp}
	Humedad: ${data.main.humidity} %
	Viento: ${data.wind.speed} m/s
	Nubes: ${data.clouds.all} %
	Salida del sol: ${getTimeFromTimestamp(data.sys.sunrise, appConfig.citiesToRetrieve[data.name.toLowerCase()].utc)}
	Puesta del sol: ${getTimeFromTimestamp(data.sys.sunset, appConfig.citiesToRetrieve[data.name.toLowerCase()].utc)}`;

	return template;
}

function templateTextValidation (data) {
	const firstElement = 0;

	if (typeof data === 'undefined') {
		return false;
	}
	if (typeof data.name === 'undefined') {
		return false;
	}
	if (typeof data.weather === 'undefined') {
		return false;
	}
	if (typeof data.weather[firstElement].description === 'undefined') {
		return false;
	}
	if (typeof data.main.temp === 'undefined') {
		return false;
	}
	if (typeof data.main.humidity === 'undefined') {
		return false;
	}
	if (typeof data.wind.speed === 'undefined') {
		return false;
	}
	if (typeof data.clouds.all === 'undefined') {
		return false;
	}
	if (typeof data.sys.sunrise === 'undefined') {
		return false;
	}
	if (typeof data.sys.sunset === 'undefined') {
		return false;
	}

	return true;
}

module.exports = { twitterClient, publishToTwitter, formatTextToTweet, templateTextValidation };
