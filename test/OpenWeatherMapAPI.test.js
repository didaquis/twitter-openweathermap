require('dotenv').config();
const { assert, expect } = require('chai');

const OpenWeatherMapAPI = require('../src/lib/owm_api/OpenWeatherMapAPI');

const appConfig = require('../src/appConfiguration');
const config_api = require('../src/lib/owm_api/config_api');

describe('Testing Open Weather Map API', () => {

	let OWM_API;
	let OWM_APIKEY;

	before('Init API', () => {
		OWM_API = new OpenWeatherMapAPI(config_api.openWeatherMapAPI);
		OWM_APIKEY = process.env.OPENWEATHERMAP_APIKEY;
	});

	describe('Open Weather Map configuration', () => {
		it('should be an object with valid properties', () => {
			assert.isObject(config_api);

			expect(config_api.hasOwnProperty('openWeatherMapAPI')).to.be.true;

			expect(config_api.openWeatherMapAPI.hasOwnProperty('baseUrl')).to.be.true;
			expect(config_api.openWeatherMapAPI.hasOwnProperty('lang')).to.be.true;
			expect(config_api.openWeatherMapAPI.hasOwnProperty('units')).to.be.true;
		});

		it('should have a valid values', () => {
			const regex_url = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;
			assert.match(config_api.openWeatherMapAPI.baseUrl, regex_url);

			const regex_lang = /[a-zA-Z]{2,10}/;
			assert.match(config_api.openWeatherMapAPI.lang, regex_lang);

			const regex_units = /metric/;
			assert.match(config_api.openWeatherMapAPI.units, regex_units);
		});
	});

	describe('API should be load correctly', () => {
		it('should load object', () => {
			expect(OWM_API).to.be.an('object');
		});

		it('should load functions', () => {
			expect(OWM_API.getWeatherByIdOfCity).to.be.a('function');
			expect(OWM_API).to.have.a.property('getWeatherByIdOfCity');
			expect(OWM_API).to.have.a.property('call');
		});

		it('should have properties defined', () => {
			expect(OWM_API).to.have.a.property('baseUrl');
			expect(OWM_API).to.have.a.property('lang');
			expect(OWM_API).to.have.a.property('units');
			expect(OWM_API).to.have.a.property('appId');

			expect(OWM_API.baseUrl).to.be.a('string');
			expect(OWM_API.lang).to.be.a('string');
			expect(OWM_API.units).to.be.a('string');
			expect(OWM_API.appId).to.be.a('string');

			expect(OWM_API.baseUrl).to.equal(config_api.openWeatherMapAPI.baseUrl);
			expect(OWM_API.lang).to.equal(`lang=${config_api.openWeatherMapAPI.lang}`);
			expect(OWM_API.units).to.equal(`units=${config_api.openWeatherMapAPI.units}`);
			expect(OWM_API.appId).to.equal(`APPID=${OWM_APIKEY}`);
		});
	});

	describe('should be an invalid request', () => {
		it('should throw error if endpoint is not defined', (done) => {
			OWM_API.call('')
				.then()
				.catch((err) => {
					expect(err.message).to.equal('Only absolute URLs are supported');
					done();
				});
		});

		it('should throw error if route is invalid', (done) => {
			OWM_API.call(`${config_api.openWeatherMapAPI.baseUrl}/fake-path`)
				.then()
				.catch((e) => {
					const fakeCodeStatus = '401';
					const errorMessage = `Fetch data response: ${fakeCodeStatus}`;
					expect(e.message).to.equal(errorMessage);
					done();
				});
		});
	});

	describe('getWeatherByIdOfCity method', () => {
		it('should throw an error if idOfCity param is not defined', (done) => {
			try {
				OWM_API.getWeatherByIdOfCity();
			} catch (e) {
				const errorMessage = 'Invalid Id of city';
				expect(e.message).to.equal(errorMessage);
				done();
			}
		});

		it('should throw an error if idOfCity param is not valid', (done) => {
			try {
				OWM_API.getWeatherByIdOfCity('string');
			} catch (e) {
				const errorMessage = 'Invalid Id of city';
				expect(e.message).to.equal(errorMessage);
				done();
			}
		});

		it('should return a valid response if idOfCity is a valid id', (done) => {
			OWM_API.getWeatherByIdOfCity(appConfig.citiesToRetrieve.terrassa.id)
				.then((res) => {
					assert.isObject(res);
					const codeForSuccess = 200;
					expect(res.cod).to.equal(codeForSuccess);
					done();
				});
		});

		it('should return a valid structured data if idOfCity is a valid id', (done) => {
			OWM_API.getWeatherByIdOfCity(appConfig.citiesToRetrieve.barcelona.id)
				.then((res) => {
					assert.isObject(res);
					const codeForSuccess = 200;
					expect(res.cod).to.equal(codeForSuccess);

					expect(res.id).to.equal(appConfig.citiesToRetrieve.barcelona.id);

					expect(res).to.have.a.property('id');
					assert.isNumber(res.id);
					expect(res).to.have.a.property('name');
					assert.isString(res.name);

					expect(res).to.have.a.property('weather');
					assert.isArray(res.weather);
					expect(res.weather[0]).to.have.a.property('main'); // eslint-disable-line no-magic-numbers
					assert.isString(res.weather[0].main); // eslint-disable-line no-magic-numbers
					expect(res.weather[0]).to.have.a.property('description'); // eslint-disable-line no-magic-numbers
					assert.isString(res.weather[0].description); // eslint-disable-line no-magic-numbers

					expect(res).to.have.a.property('main');
					assert.isObject(res.main);
					expect(res.main).to.have.a.property('temp');
					assert.isNumber(res.main.temp);
					expect(res.main).to.have.a.property('pressure');
					assert.isNumber(res.main.pressure);
					expect(res.main).to.have.a.property('humidity');
					assert.isNumber(res.main.humidity);
					expect(res.main).to.have.a.property('temp_min');
					assert.isNumber(res.main.temp_min);
					expect(res.main).to.have.a.property('temp_max');
					assert.isNumber(res.main.temp_max);

					expect(res).to.have.a.property('wind');
					assert.isObject(res.wind);
					expect(res.wind).to.have.a.property('speed');
					assert.isNumber(res.wind.speed);

					expect(res).to.have.a.property('clouds');
					assert.isObject(res.clouds);
					expect(res.clouds).to.have.a.property('all');
					assert.isNumber(res.clouds.all);

					expect(res).to.have.a.property('sys');
					assert.isObject(res.sys);
					expect(res.sys).to.have.a.property('country');
					assert.isString(res.sys.country);
					expect(res.sys).to.have.a.property('sunrise');
					assert.isNumber(res.sys.sunrise);
					expect(res.sys).to.have.a.property('sunset');
					assert.isNumber(res.sys.sunset);

					done();
				});
		});
	});
});
