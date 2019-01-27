/* Home doc */
/**
 * @file Useful functions
 * @see module:utils
 */

/* Module doc */
/**
 * Useful functions
 * @module utils
 */

const { logger } = require('../lib/config-log4js');

/**
 * Utility to detect which is the type of the parameter
 * @param  {*} 		param 	Any kind of value
 * @return {string}    		Type of the param ( 'array' | 'string' | 'number' ...)
 * @function classOf
 */
function classOf (param){
	if (param === null){
		return 'null';
	}
	if (param === undefined){
		return 'undefined';
	}
	const beginIndex = 8;
	const endIndex = -1;
	return Object.prototype.toString.call(param).slice(beginIndex, endIndex).toLowerCase();
}

/**
 * Obtain hours and minutes (UTC) from timestamp
 * @param  {integer} timestamp 	Timestamp value. Ex: 1548141113
 * @param  {string}  utcOffset 	UTC offset: Ex '+2'
 * @return {string}           	Hours and minutes of timestamp. Ex: '07:11'
 * @throws 						Will throw an error if the arguments are not valid
 * @function getTimeFromTimestamp
 */
function getTimeFromTimestamp (timestamp, utcOffset) {
	if (!timestamp || !Number.isInteger(timestamp) || !utcOffset || typeof utcOffset !== 'string') {
		const errorMessage = 'Invalid argument passed to getTimeFromTimestamp';
		logger.error(errorMessage);
		throw new Error(errorMessage);
	}

	timestamp = utcOffsetConversion(timestamp, utcOffset);

	const miliseconds = 1000;
	let timestampWithMiliseconds = timestamp * miliseconds;

	const startChart = 17;
	const endChart = 22;
	return new Date(timestampWithMiliseconds).toUTCString().slice(startChart, endChart);
}

/**
 * Apply UTC offset to timestamp
 * @param  {integer} timestamp 	Timestamp value. Ex: 1548141113
 * @param  {string}  utcOffset 	UTC offset: Ex '+2'
 * @return {integer}            Timestamp after applying the offset
 * @throws 						Will throw an error if the arguments are not valid
 * @function utcOffsetConversion
 */
function utcOffsetConversion (timestamp, utcOffset) {
	if (!timestamp || !Number.isInteger(timestamp) || !utcOffset || typeof utcOffset !== 'string') {
		const errorMessage = 'Invalid argument passed to utcOffsetConversion';
		logger.error(errorMessage);
		throw new Error(errorMessage);
	}

	const secondsOnHour = 3600;
	const firstCharacter = 0;
	let offsetValue;

	switch (utcOffset.charAt(firstCharacter)) {
		case '+':
			offsetValue = utcOffset.slice(firstCharacter);
			return timestamp + (secondsOnHour * parseInt(offsetValue));
		case '0':
			return timestamp;
		case '-':
			offsetValue = utcOffset.slice(firstCharacter);
			return timestamp - (secondsOnHour * parseInt(offsetValue));
	}
}

/**
 * Capitalize first charf of string
 * @param  {string} str
 * @return {string}
 * @throws 				Will throw an error if the argument is not valid
 * @function capitalizeText
 */
function capitalizeText (str) {
	const minimumLength = 1;
	if (!str || typeof str !== 'string' || str.length < minimumLength) {
		const errorMessage = 'Invalid argument passed to capitalizeText';
		logger.error(errorMessage);
		throw new Error(errorMessage);
	}

	const firstChar = 0;
	const secondChar = 1;
	return str.charAt(firstChar).toUpperCase() + str.slice(secondChar);
}

module.exports = { classOf, getTimeFromTimestamp, utcOffsetConversion, capitalizeText };
