/* Home doc */
/**
 * @file Entry point of application
 * @see module:app
 */

/* Module doc */
/**
 * Entry point of application
 * @module app
 */


const { appConfiguration } = require('./appConfiguration');
const log4js = require('log4js');
const { logger } = require('./lib/config-log4js');
const { getWeatherData } = require('./lib/owm');
const { formatTextToTweet, publishToTwitter, getTwitterUsername } = require('./lib/tw');
const { getRandomValue } = require('./utils/utils');


logger.info('Starting application...');

/**
 * Main clock of application. Execute main tasks periodically
 * @async
 * @function mainClock
 */
(async function mainClock (username = null) {
	try {
		if (!username) {
			username = await getTwitterUsername();
		}

		const weatherData = await getWeatherData(appConfiguration.locations);

		const minimumLengthExpected = 1;
		if (!Array.isArray(weatherData) || weatherData.length < minimumLengthExpected ) {
			const errorMessage = 'Invalid data received from API';
			throw new Error(errorMessage);
		}

		for (let index = 0; index < weatherData.length; index++) {
			const dataForTweet = formatTextToTweet(weatherData[index], getRandomValue());

			await publishToTwitter(dataForTweet, username);
		}
	} catch (e) {
		logger.error(`Error: ${e.message}`);
	}

	setTimeout(() => {
		mainClock(username);
	}, appConfiguration.publishInterval);
})();


// Application shutdown management
process.on('SIGINT', () => {
	logger.info('Stopping application...');
	log4js.shutdown();
	process.exit();
});
