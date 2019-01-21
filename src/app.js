const appConfig = require('./appConfiguration');
const getWeatherData = require('./lib/owm');

console.log('\n\n Starting application... \n'); // eslint-disable-line no-console

// ************* just for development: WIP ****************
function publishToTwitter(tweet) {
	console.log(tweet); // publish on twitter
}
function factoryFunctionPreparingTweet(data) {
	// format text...
	return data;
}
// ************* just for development: WIP ****************

const mainInterval = setInterval(async () => {
	let weatherData = await getWeatherData(appConfig.citiesToRetrieve);

	weatherData.forEach( (data) => {
		let dataForTweet = factoryFunctionPreparingTweet(data);
		publishToTwitter(dataForTweet);
	});

}, 8000); // WIP: appConfig.publishInterval


// Application shutdown management
process.on('SIGINT', () => {
	console.log('\n\n Stopping server... \n'); // eslint-disable-line no-console
	process.exit();
});