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

const md5 = require('md5');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment-timezone');
const { logger } = require('../lib/config-log4js');

/**
 * Utility to detect which is the type of the parameter
 * @param  {*} 		any 	Any kind of value
 * @return {string}    		Type of the param ( 'array' | 'string' | 'number' ...)
 * @function typeOf
 */
function typeOf (any){
	const beginIndex = 8;
	const endIndex = -1;
	return Object.prototype.toString.call(any).slice(beginIndex, endIndex).toLowerCase();
}

/**
 * Obtain hours and minutes (UTC with timezone) from timestamp
 * @param  {integer} timestamp 	Timestamp value. Ex: 1548141113
 * @param  {string}  timezone 	Timezone. Ex: 'Europe/Madrid'
 * @return {string}           	Hours and minutes of timestamp. Ex: '07:11'
 * @throws 						Will throw an error if the arguments are not valid
 * @function getTimeFromTimestamp
 */
function getTimeFromTimestamp (timestamp, timezone) {
	const regex_timezone = /[a-zA-Z]{4,24}\/[a-zA-Z_]{4,24}/;
	if (!timestamp || !Number.isInteger(timestamp) || !timezone || typeof timezone !== 'string' || !regex_timezone.test(timezone)) {
		const errorMessage = 'Invalid argument passed to getTimeFromTimestamp';
		logger.error(errorMessage);
		throw new Error(errorMessage);
	}

	const miliseconds = 1000;
	let timestampWithMiliseconds = timestamp * miliseconds;

	moment.tz.setDefault(timezone);
	return moment(timestampWithMiliseconds).format('HH:mm');
}

/**
 * Capitalize first chart of string
 * @param  {string} str String to capitalize
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

/**
 * Create a random value of 32 chars of length
 * @return {string}
 */
function randomValue () {
	const crypto = require('crypto');
	const numberOfBytes = 10;
	return crypto.randomBytes(numberOfBytes).toString('hex');
}

module.exports = { typeOf, getTimeFromTimestamp, capitalizeText, randomValue };
