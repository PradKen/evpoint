/**
 * Created by KennethObikwelu on 9/12/17.
 */


var expect = require('chai').expect;
var superTest = require('supertest');
var localHost = superTest('http://localhost:4252');

describe('ChargePoints based tests  ----- ', function () {

	it('successful retrieval - expect a 200 response', function (done) {
		localHost.post('/user/login')
			.set('Content-Type', 'application/json')
			.send({
				"username": "kobikwelu",
				"password": "Aa5233713!"
			})
			.end(function (err, res) {
				localHost.get('/api/v1/getAllChargingPoints')
					.set('Content-Type', 'application/json')
					.set('x-access-token', res.body.token)
					.set('x-key', 'kobikwelu')
					.end(function (err, res) {
						expect(res.status).to.equal(200);
						expect(res.body).to.not.equal('null');
						done();
					})
			})
	})

	it('failed retrieval - missing required parameter attribute - X-token', function (done) {
		localHost.get('/api/v1/getAllChargingPoints')
			.set('Content-Type', 'application/json')
			.set('x-access-token', '')
			.set('x-key', 'kobikwelu')
			.end(function (err, res) {
				expect(res.status).to.equal(401);
				expect(res.body.message).to.equal('Missing token or Key');
				done();
			})

	})

	it('failed retrieval - missing required parameter attribute - X-key', function (done) {
		localHost.post('/user/login')
			.set('Content-Type', 'application/json')
			.send({
				"username": "kobikwelu",
				"password": "Aa5233713!"
			})
			.end(function (err, res) {
				localHost.get('/api/v1/getAllChargingPoints')
					.set('Content-Type', 'application/json')
					.set('x-access-token', res.body.token)
					.set('x-key', '')
					.end(function (err, res) {
						expect(res.status).to.equal(401);
						expect(res.body.message).to.equal('Missing token or Key');
						done();
					})
			})
	})


	it('failed retrieval - expired X-token', function (done) {
		localHost.get('/api/v1/getAllChargingPoints')
			.set('Content-Type', 'application/json')
			.set('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MDU1MTgzODc1ODMsInJvbGUiOiJhZG1pbiJ9.4m8lUzRAASYFqKan3iQCyg79CGomCnF1XSyqrUZuskw')
			.set('x-key', 'kobikwelu')
			.end(function (err, res) {
				expect(res.status).to.equal(400);
				expect(res.body.message).to.equal('Token Expired. Please generate a new Token');
				done();
			})

	})

	it('failed retrieval - valid X-token, but invalid x-key', function (done) {
		localHost.post('/user/login')
			.set('Content-Type', 'application/json')
			.send({
				"username": "kobikwelu",
				"password": "Aa5233713!"
			})
			.end(function (err, res) {
				localHost.get('/api/v1/getAllChargingPoints')
					.set('Content-Type', 'application/json')
					.set('x-access-token', res.body.token)
					.set('x-key', 'wrongKey')
					.end(function (err, res) {
						expect(res.status).to.equal(401);
						expect(res.body.message).to.equal('Invalid User');
						done();
					})
			})

	})

})

