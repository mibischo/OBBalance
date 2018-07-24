const { google } = require('googleapis');
let Promise = require("promise");
let a = require("../config/pkey.json");

let isAuthenticated = false;
let jwtClient;
// let email = process.env.EMAIL;
// let pkey = process.env.PKEY;
let email = a.client_email;
let pkey = a.private_key;

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

let sheetdata = {
    timestamp: new Date,
    data: []
};

module.exports = {
    getBalanceData: function() {
        return new Promise(function (resolve, reject) {
            let now = new Date();
            let diff = now - sheetdata.timestamp;
            let diffMins = Math.round(((diff % 86400000) % 3600000) / 60000);
            if (diffMins > 10 || sheetdata.data.length == 0) {
                console.log('fetching new data');
                if (!isAuthenticated) {
                    authenticate();
                }

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
                            sheetdata.data = data;
                            resolve(data);
                        }
                    }
                );
            } else {
                console.log('old data');
                resolve(sheetdata.data);
            }
        });
    }
};
