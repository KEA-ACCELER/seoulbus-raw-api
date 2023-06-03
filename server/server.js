const express = require('express')
const axios = require("axios");
const mysql = require("mysql2/promise");
const app = express()
const port = 3000

let STEP = 10;

app.use(express.json());
app.use(express.static('/app/front/build'));

app.post('/api/bus-ride', (req, res) => {
  busRide(req.body.year_list, req.body.month_list, () => {
    res.send('bus ride api finished'); 
  });
})

app.post('/api/bus-stop', (req, res) => {
  busStop(() => {
    res.send('bus stop api finished'); 
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

/**
 * Get Bus Ride, Alight Info
 * 
 * META 
 * 공개 일자 | 2016.01.04.
 *
 * year_list, month_list example
 * year_list = [2021, 2022];
 * month_list = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
 */
async function busRide(year_list, month_list, callback) {
  let connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    insecureAuth: true,
  });

  for (let year of year_list) {
    console.log("year: ", year);
    for (let month of month_list) {
      let page = 1;

      while (true) {
        let url = "http://openapi.seoul.go.kr:8088/" + process.env.API_KEY + "/json/CardBusTimeNew/" + page + "/" + (page + STEP - 1) + "/" + year + '' + month;
        let response = await axios.get(url);
        let body = response.data;
        console.log("body: ", body);
        if (body.CardBusTimeNew.RESULT.MESSAGE && body.CardBusTimeNew.RESULT.MESSAGE === "정상 처리되었습니다") {
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
  callback();
}


/*
 *   Get Bus Stop Location Info
 *
 */
async function busStop(callback) {
  let connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    insecureAuth: true,
  });
  let page = 1;

  while (true) {
    let url = "http://openapi.seoul.go.kr:8088/" + process.env.API_KEY + "/json/busStopLocationXyInfo/" + page + "/" + (page + STEP - 1) + "/";

    let response = await axios.get(url);
    let body = response.data;
    //console.log("body: ", body);
    if (body.busStopLocationXyInfo.RESULT.MESSAGE && body.busStopLocationXyInfo.RESULT.MESSAGE === "정상 처리되었습니다") {
      //console.log("Response received", body);
      for (let element of body.busStopLocationXyInfo.row) {
        let results = await connection.query(
          "INSERT INTO busStation SET ?",
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
  }
  callback();
}
