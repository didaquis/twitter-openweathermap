# twitter-openweathermap

This is a Twitter bot made for Node.js. This bot publishes wetaher data from OpenWeatherMap API.  

## Some useful links
* https://openweathermap.org/api
* https://apps.twitter.com 
* https://developer.twitter.com/en/docs/media/upload-media/api-reference
* https://developer.twitter.com/en/docs/media/upload-media/api-reference/post-media-upload
* https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/post-statuses-update

## How to use
* Download this repo
* Install dependencies:`npm install`
* You must configure the authentication data of Twitter API and OpenWeatherMap API
  * Write your credentials in file `_env`
  * Rename the file `_env` to `.env`
* Edit the file `src/appConfiguration.js` for configure the application
* Execute script with `node .` or `npm start`
