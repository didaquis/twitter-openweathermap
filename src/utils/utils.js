/**
 * Utility to detect which is the type of the parameter
 * @param  {*} 		param 	Any kind of value
 * @return {string}    		Type of the param ( array | string | number ...)
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
 * Obtain hours and minutes from timestamp
 * @param  {integer} timestamp 	Timestamp value. Ex: 1548141113
 * @return {string}           	Hours and minutes of timestamp. Ex: '23:02'
 */
function getTimeFromTimestamp (timestamp) {
	if (!timestamp || !Number.isInteger(timestamp)) {
		throw new Error('Invalid argument passed to getTimeFromTimestamp');
	}

	const startChart = 16;
	const endChart = 21;
	return new Date(timestamp).toString().slice(startChart, endChart);
}

/**
 * Capitalize first charf of string
 * @param  {string} str
 * @return {string}
 */
function capitalizeText (str) {
	const minimumLength = 1;
	if (!str || typeof str !== 'string' || str.length < minimumLength) {
		throw new Error('Invalid argument passed to capitalizeText');
	}

	const firstChar = 0;
	const secondChar = 1;
	return str.charAt(firstChar).toUpperCase() + str.slice(secondChar);
}

module.exports = { classOf, getTimeFromTimestamp, capitalizeText };
