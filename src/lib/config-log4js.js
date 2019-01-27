/* Home doc */
/**
 * @file Manages the configuration settings for logger module.
 * @see module:logger
 */

/* Module doc */
/**
 * Configuration settings for logger module
 * @module logger
 */

const log4js = require('log4js');

/**
 * log4js configuration (All loggers are printed in console. Loggers WARN, ERROR and FATAL are logged in a log file).
 * @example
 * logger.trace('trace');
 * logger.debug('debug');
 * logger.info('info');
 * logger.warn('warn');
 * logger.error('error');
 * logger.fatal('fatal');
 */
log4js.configure({
	appenders: {
		out:{ type: 'stdout' },
		file_log_info: { type: 'file', filename: 'logs/application.log', maxLogSize: 204800, keepFileExt: true },
		file_log_error: { type: 'file', filename: 'logs/application_error.log', maxLogSize: 204800, keepFileExt: true },
		file_log_info_filter: { type:'logLevelFilter', level: 'info', appender: 'file_log_info' },
		file_log_error_filter: { type:'logLevelFilter', level: 'error', appender: 'file_log_error' }
	},
	categories: {
		default: { appenders: [ 'file_log_info_filter', 'file_log_error_filter', 'out'], level: 'all' }
	}
});

/**
 * Logger, use log4js config settings 
 */
const logger = log4js.getLogger();


module.exports = { logger };
