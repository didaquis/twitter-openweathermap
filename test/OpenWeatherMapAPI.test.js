require('dotenv').config();
const { assert, expect } = require('chai');

const OpenWeatherMapAPI = require('../src/lib/OpenWeatherMapAPI');

const appConfig = require('../src/appConfiguration');

describe('Testing Open Weather Map API', () => {

	let OWM_API;
	let OWM_APIKEY;

	before('Init API', () => {
		OWM_API = new OpenWeatherMapAPI(appConfig.openWeatherMapAPI);
		OWM_APIKEY = process.env.OPENWEATHERMAP_APIKEY;
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

			expect(OWM_API.baseUrl).to.equal(appConfig.openWeatherMapAPI.baseUrl);
			expect(OWM_API.lang).to.equal(`lang=${appConfig.openWeatherMapAPI.lang}`);
			expect(OWM_API.units).to.equal(`units=${appConfig.openWeatherMapAPI.units}`);
			expect(OWM_API.appId).to.equal(`APPID=${OWM_APIKEY}`);
		});
	});

	describe('should be an invalid request', () => {
		it('should throw error if endpoint is not defined', (done) => {
			OWM_API.call('')
				.then(() => {
					done();
				}).catch((err) => {
					expect(err.message).to.equal('Only absolute URLs are supported');
					done();
				});
		});

		it('should throw error 401 if route is invalid', (done) => {
			OWM_API.call(`${appConfig.openWeatherMapAPI.baseUrl}/fake-path`)
				.then(() => {
					done();
				}).catch((err) => {
					const errorForInvalidRoute = '401';
					expect(err.message).to.equal(errorForInvalidRoute);
					done();
				});
		});
	});

	describe('getWeatherByIdOfCity', () => {
		it('should throw an error if idOfCity param is not defined', (done) => {
			try {
				OWM_API.getWeatherByIdOfCity();
			} catch (e) {
				const errorMessage = 'Error: Invalid Id of city';
				expect(e.message).to.equal(errorMessage);
				done();
			}
		});

		it('should throw an error if idOfCity param is not valid', (done) => {
			try {
				OWM_API.getWeatherByIdOfCity('string');
			} catch (e) {
				const errorMessage = 'Error: Invalid Id of city';
				expect(e.message).to.equal(errorMessage);
				done();
			}
		});
	});

	it('should return a valid data if idOfCity is a valid id', (done) => {
		OWM_API.getWeatherByIdOfCity(appConfig.citiesToRetrieve[0].id)
			.then((res) => {
				const codeForSuccess = 200;
				expect(res.cod).to.equal(codeForSuccess);
				expect(res.id).to.equal(appConfig.citiesToRetrieve[0].id);
				expect(res.name).to.equal(appConfig.citiesToRetrieve[0].name);
				done();
			});
	});
});
