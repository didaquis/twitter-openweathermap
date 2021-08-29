require('dotenv').config();
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const sinon = require('sinon');

const OpenWeatherMapAPI = require('../src/lib/owm_api/OpenWeatherMapAPI');
const config_api = require('../src/lib/owm_api/config_api');

describe('Testing Open Weather Map API', () => {

	let OWM_API;
	let OWM_APIKEY;

	before('Init API', () => {
		OWM_API = new OpenWeatherMapAPI(config_api.openWeatherMapAPI);
		OWM_APIKEY = process.env.OPENWEATHERMAP_APIKEY;
	});

	describe('API should be load correctly', () => {

		before(() => {
			console.log('\n NOTE: You need to configure ".env" file for pass "API should be load correctly" test suite \n'); // eslint-disable-line no-console
		});

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

		it('should return a valid response if idOfCity is a valid id (stub request)', (done) => {
			OWM_API.getWeatherByIdOfCity = sinon.stub(OWM_API, 'getWeatherByIdOfCity').callsFake((idOfCity) => {
				const expectedIdOfCity = 42;
				expect(idOfCity).to.equal(expectedIdOfCity);
				const res = {
					cod: 200
				};
				return Promise.resolve(res);
			});

			const idOfCity = 42;
			OWM_API.getWeatherByIdOfCity(idOfCity)
				.then((res) => {
					assert.isObject(res);
					const codeForSuccess = 200;
					expect(res.cod).to.equal(codeForSuccess);
					sinon.restore();
					done();
				});
		});
	});
});
