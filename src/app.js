const appConfig = require('./appConfiguration');
const { getWeatherData } = require('./lib/owm');
const { formatTextToTweet, publishToTwitter } = require('./lib/tw');

console.log('\n\n Starting application... \n'); // eslint-disable-line no-console

setInterval(async () => {
	try {
		let weatherData = await getWeatherData(appConfig.citiesToRetrieve);

		weatherData.forEach( (data) => {
			let dataForTweet = formatTextToTweet(data);
			publishToTwitter(dataForTweet);
		});
	} catch (e) {
		console.error(`Error: ${e.message}`); // eslint-disable-line no-console
	}
}, 8000); // WIP: appConfig.publishInterval


// Application shutdown management
process.on('SIGINT', () => {
	console.log('\n\n Stopping application... \n'); // eslint-disable-line no-console
	process.exit();
});
