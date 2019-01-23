const Twitter = require('twitter');

require('dotenv').config();

const { classOf, getTimeFromTimestamp } = require('../utils/utils');

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

// ************* just for development: WIP ****************
function formatTextToTweet (data) {
	if (!data || classOf(data) !== 'object') {
		throw new Error('Invalid argument to formatTextToTweet');
	}

	/*

	var h = new Date(timestamp).getHours();
	var m = new Date(timestamp).getMinutes();

	h = (h<10) ? '0' + h : h;
	m = (m<10) ? '0' + m : m;

	var output = h + ':' + m;
	 */



	/*
		Terrassa
		Temperatura actual: 4.58
		Temperatura mínima: 3
		Temperatura máxima: 6
		Viento: 2.6
		Nubes: 0
		Cielo claro
		Salida del sol: xx:xx
		Puesta del sol: xx:xx
	 */


	/*
	{ coord: { lon: 2.02, lat: 41.57 },
	  weather:
	   [ { id: 800,
	       main: 'Clear',
	       description: 'cielo claro',
	       icon: '01n' } ],
	  base: 'stations',
	  main:
	   { temp: 4.58,
	     pressure: 1006,
	     humidity: 86,
	     temp_min: 3,
	     temp_max: 6 },
	  visibility: 10000,
	  wind: { speed: 2.6, deg: 280 },
	  clouds: { all: 0 },
	  dt: 1548196200,
	  sys:
	   { type: 1,
	     id: 6414,
	     message: 0.0033,
	     country: 'ES',
	     sunrise: 1548141113,
	     sunset: 1548176152 },
	  id: 3108286,
	  name: 'Terrassa',
	  cod: 200 }
	 */

	return data;
}
// ************* just for development: WIP ****************

module.exports = { twitterClient, formatTextToTweet, publishToTwitter };
