
var request = require('request');

var url = 'http://openapi.seoul.go.kr:8088/65595a50536368723130314658624a4f/json/busStopLocationXyInfo/1/5/';

request({
	url: url,
	method: 'GET'
}, function (error, response, body) {
	//console.log('Status', response.statusCode);
	//console.log('Headers', JSON.stringify(response.headers));
	console.log('Reponse received', body);
});