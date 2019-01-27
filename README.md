# twitter-openweathermap

This is a Twitter bot made for Node.js. This bot publishes current weather data of the cities that you choose. Meteorological data are provided by OpenWeatherMap API. 

Example of tweet published by this application: https://twitter.com/didipi_bot/status/1089318407437279233 


## Requirements
* Node.js 9.4 or higher
* A Twitter account and Twitter app registered for use their API
* A registered account on OpenWeatherMap and a token for use theri API


## How to use

### Prepare the application:
* Download this repo: https://github.com/didaquis/twitter-openweathermap
* Install dependencies:`npm install`
* You must configure the authentication data of Twitter API and OpenWeatherMap API:
  * Write your credentials in file `_env`
  * Rename the file `_env` to `.env`
* You must edit the file `src/appConfiguration.js` for configure the application.
  * For each city to retrieve data from OpenWeatherMap API you need to create a new property inside `citiesToRetrieve`. The name of the property is just for reference, choose any valid string. This key must contain a new object with property `id` and his value must be a valid ID value of city. You can see list of ID values of cityes on the documentation of OpenWeatherMap API. You must include another property called `utc` with a value equivalent to UTC local time of the city.
  ```
  /* Example of configuration */
  // ...
  citiesToRetrieve: {
		fooCity: {
			id: 1111111,
			utc: '+1'
		},
		barCity: {
			id: 2222222,
			utc: '0'
		},
		,
		bizCity: {
			id: 333333,
			utc: '-2'
		}
	}
  // ...
  ```
  * If you wish, you can configure interval of execution. This value are the number of miliseconds of delay before new execution of code.
* If you want, you can edit some value of OpenWeatherMap API on the file `src/lib/owm_api/config_api.js`. This step is not necessary.

**Warning:** You must keep in mind the API restrictions. For example, you can't publish one thousand tweets in a row or publish the same data over and over again. Both Twitter and OpenWeatherMap impose a series of limitations in their API.

### Execute the application:
* Execute script with `node .` or `npm start`


## For development:
* For run app: `npm run dev`
* For run test: `npm run test`
* For run test and coverage report: `npm run test:coverage`
* For run documentation: `npm run doc-view`
* For delete `doc` and `logs` folders: `npm run purge`
* For run linter: `npm run lint`


## Useful links

### OpenWeatherMap
* https://openweathermap.org/api (Current weather data API)

### Twitter 
* https://apps.twitter.com 
* https://developer.twitter.com/en/docs/basics/getting-started

