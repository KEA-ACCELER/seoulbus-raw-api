var axios = require("axios");
var mysql = require("mysql2/promise");


// connection.connect();

var STEP = 10;

/**
 * Get Bus Ride, Alight Info
 *
 */
// 지정된 ID를 가진 유저에 대한 요청
// axios
//   .get("/user?ID=12345")
//   .then(function (response) {
//     // 성공 핸들링
//     console.log(response);
//   })
//   .catch(function (error) {
//     // 에러 핸들링
//     console.log(error);
//   })
//   .finally(function () {
//     // 항상 실행되는 영역
//   });

var url =
    "http://openapi.seoul.go.kr:8088/65595a50536368723130314658624a4f/json/CardBusTimeNew/1/5/201511";

// axios.get(url)
//   .then(function (error, response, body) {
//     body = JSON.parse(body);
//     body.CardBusTimeNew.row.forEach((element) => {
//       connection.query(
//         "INSERT INTO seoulRide SET ?",
//         element,
//         function (error, results, fields) {
//           if (error) throw error;
//           console.log("The solution is: ", results);
//         }
//       );
//     });
//   });

/*
 *   Get Bus Station Location Info
 *
 */
async function main() {
    let connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_ROOT_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        insecureAuth: true,
    });
    let page = 1;

    while (true) {
        var url2 = "http://openapi.seoul.go.kr:8088/65595a50536368723130314658624a4f/json/busStopLocationXyInfo/" + page + "/" + (page + STEP - 1) + "/";

        let response = await axios.get(url2);
        let body = response.data;
        console.log("body: ", body);
        if (body.busStopLocationXyInfo.RESULT.MESSAGE === "정상 처리되었습니다") {
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
}

main();
