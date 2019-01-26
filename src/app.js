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
const { formatTextToTweet, publishToTwitter } = require('./lib/tw');


logger.info('Starting application...');

/**
 * Main clock of application. Execute main task periodically
 */


(async function mainClock () {
	try {
		let weatherData = await getWeatherData(appConfig.citiesToRetrieve);

		weatherData.forEach( (data) => {
			let dataForTweet = formatTextToTweet(data);
			publishToTwitter(dataForTweet);
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
