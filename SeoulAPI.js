var request = require('request');
var mysql = require('mysql2');

var connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    insecureAuth: true

});

connection.connect();

var url = 'http://openapi.seoul.go.kr:8088/65595a50536368723130314658624a4f/json/CardBusTimeNew/1/5/201511';

request({
    url: url,
    method: 'GET',

}, function (error, response, body) {
    //console.log('Status', response.statusCode);
    //console.log('Headers', JSON.stringify(response.headers));
    //console.log('Response received', body);
    body = JSON.parse(body);
    //console.log(body.CardBusTimeNew.row);
    body.CardBusTimeNew.row.forEach(element => {
        connection.query('INSERT INTO seoulRide SET ?', element, function (error, results, fields) {
            if (error) throw error;
            console.log('The solution is: ', results);
            // connection.query('SELECT * FROM seoulRide', function (error, results, fields) {
            //     if (error) throw error;
            //     console.log('This is SELECT QUERY!! : ', results);
            // });
        }
        );
    });




});

