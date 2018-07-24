const { google } = require('googleapis');
let Promise = require("promise");

let isAuthenticated = false;
let jwtClient;
let email = process.env.EMAIL;
let pkey = process.env.PKEY;

function authenticate() {
    jwtClient = new google.auth.JWT(email,
        null,
        pkey,
        ['https://www.googleapis.com/auth/spreadsheets']);

    jwtClient.authorize(function (err, tokens) {
        if (err) {
            console.log(err);
            isAuthenticated = false;
            return;
        } else {
            console.log("Successfully connected!");
            isAuthenticated = true;
        }
    });
}

module.exports = {
    getBalanceData: function() {
        return new Promise(function (resolve, reject) {
            if (!isAuthenticated) {
                authenticate();
            }

            // if (!isAuthenticated) {
            //     console.log("Authentication failed, can't fetch data");
            // } else {
                //Google Sheets API
                let spreadsheetId = '1vH09blVSor23uwzBirvcH54TzmpFUM_Fp7j6xZ7syXg';
                let sheetName = 'Balance!B5:E700'
                let sheets = google.sheets('v4');
                sheets.spreadsheets.values.get({
                        auth: jwtClient,
                        spreadsheetId: spreadsheetId,
                        range: sheetName
                    }, 
                    function (err, response) {
                        if (err) {
                            console.log('The API returned an error: ' + err);
                        } else {
                            let data = [];
                            response.data.values.map((row) => {
                                if (row[0] != '') {
                                    let player = {
                                        name: row[0],
                                        balance: parseInt(row[1].replace(/,/g, '')),
                                        paid: parseInt(row[2].replace(/,/g, '')),
                                        owed: parseInt(row[3].replace(/,/g, ''))
                                    };
                                    data.push(player);
                                }
                            });
                            resolve(data);
                        }
                    }
                );
            // }
        });
    }
};
