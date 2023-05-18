var axios = require("axios");
var mysql = require("mysql2/promise");


// connection.connect();

var STEP = 10;
var YEAR_LIST = [2021, 2022];
var MONTH_LIST = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
/**
 * Get Bus Ride, Alight Info
 * 
 * META 
 * 공개 일자 | 2016.01.04.
 *
 */
async function busRide() {
    let connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_ROOT_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        insecureAuth: true,
    });

    for (let year of YEAR_LIST) {
        console.log("year: ", year);
        for (let month of MONTH_LIST) {
            let page = 1;

            while (true) {
                var url =
                    "http://openapi.seoul.go.kr:8088/"+process.env.API_KEY+"/json/CardBusTimeNew/" + page + "/" + (page + STEP - 1) + "/" + year + '' + month;
                let response = await axios.get(url);
                let body = response.data;
                console.log("body: ", body);
                if (body.CardBusTimeNew.RESULT.MESSAGE === "정상 처리되었습니다") {
                    for (let element of body.CardBusTimeNew.row) {
                        let results = await connection.query(
                            "INSERT INTO seoulRide SET ?",
                            element
                        );
                        console.log(results);
                    }
                }
                else {
                    console.log("Response received", body);
                    break;
                }
                page += STEP;
            };
        }
    }
}


/*
 *   Get Bus Station Location Info
 *
 */
async function busStation() {
    let connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_ROOT_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        insecureAuth: true,
    });
    let page = 1;

    while (true) {
        var url2 = "http://openapi.seoul.go.kr:8088/"+process.env.API_KEY+"/json/busStopLocationXyInfo/" + page + "/" + (page + STEP - 1) + "/";

        let response = await axios.get(url2);
        let body = response.data;
        //console.log("body: ", body);
        if (body.busStopLocationXyInfo.RESULT.MESSAGE === "정상 처리되었습니다") {
            //console.log("Response received", body);
            for (let element of body.busStopLocationXyInfo.row) {
                let results = await connection.query(
                    "INSERT INTO busStation SET ?",
                    element
                );
                //console.log(results);
            }
        }
        else {
            console.log("Response received", body);
            break;
        }
        page += STEP;
    }
}

busStation();
busRide();