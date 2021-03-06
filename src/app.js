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


const appConfig = require('./appConfiguration');
const log4js = require('log4js');
const { logger } = require('./lib/config-log4js');
const { getWeatherData } = require('./lib/owm');
const { formatTextToTweet, publishToTwitter, manageTwitterResponse } = require('./lib/tw');
const { randomValue } = require('./utils/utils');


logger.info('Starting application...');

/**
 * Main clock of application. Execute main tasks periodically
 * @async
 * @function mainClock
 */
(async function mainClock () {
	try {
		let weatherData = await getWeatherData(appConfig.citiesToRetrieve);

		const minimumLengthExpected = 1;
		if (!Array.isArray(weatherData) || weatherData.length < minimumLengthExpected ) {
			const errorMessage = 'Invalid data received from API';
			throw new Error(errorMessage);
		}

		weatherData.forEach( (data) => {
			let dataForTweet = formatTextToTweet(data, randomValue());

			publishToTwitter(dataForTweet, manageTwitterResponse);
		});
	} catch (e) {
		logger.error(`Error: ${e.message}`);
	}

	setTimeout(mainClock, appConfig.publishInterval);
})();


// Application shutdown management
process.on('SIGINT', () => {
	logger.info('Stopping application...');
	log4js.shutdown();
	process.exit();
});
