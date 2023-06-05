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

const { TwitterApi } = require('twitter-api-v2');

require('dotenv').config();

const { logger } = require('../lib/config-log4js');
const { typeOf, capitalizeText, getTimeFromTimestamp, isProduction } = require('../utils/utils');
const { appConfiguration } = require('../appConfiguration');

/**
 * An instance of Twitter client class to communicate with Twitter API
 * @type {Twitter}
 */
const twitterClient = new TwitterApi({
	appKey: process.env.TWITTER_CONSUMER_KEY,
	appSecret: process.env.TWITTER_CONSUMER_SECRET,
	accessToken: process.env.TWITTER_ACCESS_TOKEN_KEY,
	accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

/**
 * Publish a new tweet to Twitter
 * @param {string}   textToTweet 	Text of tweet
 * @param {string}   username 		The username of the Twitter Account
 * @function publishToTwitter
 * @async
 */
async function publishToTwitter (textToTweet, username) {
	if (!textToTweet || typeof textToTweet !== 'string' || !username) {
		const errorMessage = 'Invalid argument passed to publishToTwitter';
		throw new Error(errorMessage);
	}

	if (!isProduction()){
		logger.debug(textToTweet);
		logger.debug(username);
		return;
	}

	try {
		const { data } = await twitterClient.v2.tweet(textToTweet);

		const urlOfPublishedTweet = `https://twitter.com/${username}/status/${data.id}`;

		logger.info(`Tweet published: ${urlOfPublishedTweet}`);
	} catch (error) {
		const errorMessage = `Error trying to publish a tweet: ${error.message}`;
		logger.error(errorMessage);
	}
}


/**
 * Returns the username of the Twitter account
 * @function getTwitterUsername
 * @async
 * @returns {string}
 */
async function getTwitterUsername () {
	try {
		if (!isProduction()){
			return 'fake_username_for_debug';
		}

		const user = await twitterClient.v2.me();
		/*
		// user
		{
			data: {
				id: '844135277169917953',
				name: 'didipi_bot',
				username: 'didipi_bot'
			}
		}
		*/
	
		return user.data.username;	
	} catch (error) {
		const errorMessage = `Error trying to get the user name: ${error.message}`;
		logger.error(errorMessage);
	}
};

/**
 * Create text of tweet using data received from OpenWeatherMAP API
 * @param  {object} data 		Raw data from OpenWeatherMAP API
 * @param  {string} randomID 	A random value to avoid error with code 187 of Twitter API (Status is a duplicate)
 * @returns {string}      		The text of a tweet generated using a template
 * @throws 				 		Will throw an error if the argument is not valid
 * @function formatTextToTweet
 */
function formatTextToTweet (data, randomID) {
	if (!data || typeOf(data) !== 'object' || !randomID || typeOf(randomID) !== 'string') {
		const errorMessage = 'Invalid arguments passed to formatTextToTweet';
		throw new Error(errorMessage);
	}

	if (!templateTextValidation (data)) {
		const errorMessage = 'Required data on formatTextToTweet not found';
		throw new Error(errorMessage);
	}

	const findLocationById = (id) => {
		return appConfiguration.locations.find((location) => location.id === id);
	}; 

	const firstElement = 0;
	const template = `
	${capitalizeText(data.name)}

	${capitalizeText(data.weather[firstElement].description)}
	Temperatura: ${data.main.temp} ℃
	Humedad: ${data.main.humidity} %
	Viento: ${data.wind.speed} m/s
	Nubes: ${data.clouds.all} %
	Salida del sol: ${getTimeFromTimestamp(data.sys.sunrise, findLocationById(data.id).timezone)}
	Puesta del sol: ${getTimeFromTimestamp(data.sys.sunset, findLocationById(data.id).timezone)}
	-------------------------
	ID: ${randomID}`;

	return template;
}

/**
 * Validate if data required for generate text of tweet is provided
 * @param  {object} data  Raw data from OpenWeatherMAP API
 * @returns {boolean}      Return true if all required data is provided
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

module.exports = { getTwitterUsername, publishToTwitter, formatTextToTweet, templateTextValidation };
