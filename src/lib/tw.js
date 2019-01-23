const Twitter = require('twitter');

require('dotenv').config();

const { classOf, getTimeFromTimestamp, capitalizeText } = require('../utils/utils');

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
		throw new Error('Invalid argument to publishToTwitter');
	}

	// twitterClient.post('statuses/update', {status: textToTweet }, function (error, tweet, response) {
	// 	if (error) {
	// 		throw error;
	// 	}
	// 	const statusCode_OK = 200;
	// 	if (response.statusCode !== statusCode_OK) {
	// 		throw new Error(`Status code of response after try to publish a tweet: ${response.statusCode}`);
	// 	}
	// 	console.log(`Tweet published: \n ${tweet}`); // eslint-disable-line no-console
	// });
}

/**
 * Create text of tweet using data received from OpenWeatherMAP API
 * @param  {object} data Raw data from OpenWeatherMAP API
 * @return {string]}     A templeted string with text of new tweet
 */
function formatTextToTweet (data) {
	if (!data || classOf(data) !== 'object') {
		throw new Error('Invalid argument to formatTextToTweet');
	}

	const firstElement = 0;

	const template = `
	${data.name}
	Temperatura actual: ${data.main.temp}
	Temperatura mínima: ${data.main.temp_min}
	Temperatura máxima: ${data.main.temp_max}
	Viento: ${data.wind.speed}
	Nubes: ${data.clouds.all}
	${capitalizeText(data.weather[firstElement].description)}
	Salida del sol: ${getTimeFromTimestamp(data.sys.sunrise)}
	Puesta del sol: ${getTimeFromTimestamp(data.sys.sunset)}`;

	return template;
}

module.exports = { twitterClient, formatTextToTweet, publishToTwitter };
