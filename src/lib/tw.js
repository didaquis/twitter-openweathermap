/* Home doc */
/**
 * @file Twitter client functions
 * @see module:tw
 */

/* Module doc */
/**
 * Twitter client functions
 * @module tw
 */

const Twitter = require('twitter');

require('dotenv').config();

const { logger } = require('../lib/config-log4js');
const { classOf, capitalizeText, getTimeFromTimestamp } = require('../utils/utils');
const appConfig = require('../appConfiguration');

/**
 * An instance of Twitter client class to communicate with Twitter API
 * @type {Twitter}
 */
const twitterClient = new Twitter({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
	access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

/**
 * Publish a new tweet to Twitter
 * @param {string}   textToTweet 	Text of tweet
 * @param {function} callback 		Callback
 * @throws 							Will throw an error if the argument is not valid
 * @function publishToTwitter
 * @async
 */
function publishToTwitter (textToTweet, callback) {
	if (!textToTweet || typeof textToTweet !== 'string' || typeof callback !== 'function') {
		const errorMessage = 'Invalid argument passed to publishToTwitter';
		throw new Error(errorMessage);
	}

	twitterClient.post('statuses/update', { status: textToTweet }, callback);
}

/**
 * Manage the response of Tweeter
 * @param  {object|null} error  	Error object from Twitter API
 * @param  {object} 	 tweet    	Tweet object from Twitter API
 * @param  {object} 	 response 	Response object from Twitter API
 * @throws 							Will throw an error if Twitter send an error
 * @throws 							Will throw an error if Twitter send a status code different than 200
 * @function manageTwitterResponse
 */
function manageTwitterResponse (error, tweet, response) {
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
}


/**
 * Create text of tweet using data received from OpenWeatherMAP API
 * @param  {object} data 		Raw data from OpenWeatherMAP API
 * @param  {string} randomID 	A random value to avoid error with code 187 of Twitter API (Status is a duplicate)
 * @return {string}      		A templeted string with text of new tweet
 * @throws 				 		Will throw an error if the argument is not valid
 * @function formatTextToTweet
 */
function formatTextToTweet (data, randomID) {
	if (!data || classOf(data) !== 'object' || !randomID || classOf(randomID) !== 'string') {
		const errorMessage = 'Invalid arguments passed to formatTextToTweet';
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
	Temperatura: ${data.main.temp} ℃
	Humedad: ${data.main.humidity} %
	Viento: ${data.wind.speed} m/s
	Nubes: ${data.clouds.all} %
	Salida del sol: ${getTimeFromTimestamp(data.sys.sunrise, appConfig.citiesToRetrieve[data.name.toLowerCase()].utc)}
	Puesta del sol: ${getTimeFromTimestamp(data.sys.sunset, appConfig.citiesToRetrieve[data.name.toLowerCase()].utc)}
	-------------------------
	ID: ${randomID}`;

	return template;
}

/**
 * Validate if data required for generate text of tweet is provided
 * @param  {object} data  Raw data from OpenWeatherMAP API
 * @return {boolean}      Return true if all required data is provided
 * @function templateTextValidation
 * @private
 */
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

module.exports = { twitterClient, publishToTwitter, manageTwitterResponse, formatTextToTweet, templateTextValidation };
