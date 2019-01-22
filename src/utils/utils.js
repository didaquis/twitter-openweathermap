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

module.exports = { classOf };