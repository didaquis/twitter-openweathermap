/* Home doc */
/**
 * @file Main configuration for the application
 * @see module:appConfiguration
 */

/* Module doc */
/**
 * Main configuration for the application
 * @module appConfiguration
 */


/**
 * App configuration
 * @type {object}
 */
const appConfiguration = Object.freeze({
	locations: [
		{
			id: 3108286, // Terrassa
			timezone: 'Europe/Madrid'
		},
		{
			id: 3128760, // Barcelona
			timezone: 'Europe/Madrid'
		},
		{
			id: 3119694, // La Garriga
			timezone: 'Europe/Madrid'
		},
	],
	publishInterval: 1200000 // 1200000 = 20 minutes
});

/** App Configuration */
module.exports = { appConfiguration };
