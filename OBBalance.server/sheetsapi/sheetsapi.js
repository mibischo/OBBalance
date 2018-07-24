const { google } = require('googleapis');
let Promise = require("promise");
let a = require("../config/pkey.json");

let isAuthenticated = false;
let jwtClient;
// let email = process.env.EMAIL;
// let pkey = process.env.PKEY;
let email = a.client_email;
let pkey = a.private_key;
// let sheet = { // new sheet
//     spreadsheetId: '1gA3EqP8ALjjdwpNCA3uxXro0g0BlHoKqR4nTxi_IqA0',
//     balanceSheet: 'Balance!B5:E700',
//     raidSheet: 'OTB!ZU2:ZY415',
//     attendanceSheet: ''
// };
let sheet = { // old sheet for dev
    spreadsheetId: '1vH09blVSor23uwzBirvcH54TzmpFUM_Fp7j6xZ7syXg',
    balanceSheet: 'Balance!B5:E700',
    raidSheet: 'OTB!ZU2:ZY415',
    attendanceSheet: 'OTB!B4:ZR700'
};

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

let balanceData = {
    timestamp: new Date(),
    data: []
};

let attendanceData = {
    timestamp: new Date(),
    raids: [],
    playerAttendance: []
};

module.exports = {
    getBalanceData: function() {
        return new Promise(function (resolve, reject) {
            let now = new Date();
            let diff = now - balanceData.timestamp;
            let diffMins = Math.round(((diff % 86400000) % 3600000) / 60000);
            if (diffMins > 10 || balanceData.data.length == 0) {
                console.log('fetching new data');
                if (!isAuthenticated) {
                    authenticate();
                }

                //Google Sheets API
                let sheets = google.sheets('v4');
                sheets.spreadsheets.values.get({
                        auth: jwtClient,
                        spreadsheetId: sheet.spreadsheetId,
                        range: sheet.balanceSheet
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
                            balanceData.timestamp = new Date();
                            balanceData.data = data;
                            resolve(data);
                        }
                    }
                );
            } else {
                console.log('old data');
                resolve(balanceData.data);
            }
        });
    },

    getAttendanceData: function () {
        return new Promise(function (resolve, reject) {
            let now = new Date();
            let diff = now - attendanceData.timestamp;
            let diffMins = Math.round(((diff % 86400000) % 3600000) / 60000);
            if (diffMins > 10 || Object.keys(attendanceData.raids).length === 0) {
                console.log('fetching new data');
                if (!isAuthenticated) {
                    authenticate();
                }

                //Google Sheets API
                let sheets = google.sheets('v4');

                // get raids
                sheets.spreadsheets.values.get({
                        auth: jwtClient,
                        spreadsheetId: sheet.spreadsheetId,
                        range: sheet.raidSheet
                    }, 
                    function (err, response) {
                        if (err) {
                            console.log('The API returned an error: ' + err);
                        } else {
                            let data = [];
                            for (i=0; i<response.data.values.length; i+=6) {
                                let names = response.data.values[i];
                                let pot = response.data.values[i+1];
                                let boosters = response.data.values[i+2];
                                let quater = response.data.values[i+3];
                                let raiderCut = response.data.values[i+4];
                                let leaderCut = response.data.values[i+5];

                                for (j=0; j<5; j++) {
                                    if (isNaN(response.data.values[i][j])) {
                                        let raid = {
                                            hash: '',
                                            name: names[j],
                                            pot: parseFloat(pot[j].replace(/,/g, '')),
                                            boosters: parseInt(boosters[j]),
                                            quater: parseFloat(quater[j].replace(/,/g, '')),
                                            raiderCut: parseFloat(raiderCut[j].replace(/,/g, '')),
                                            leaderCut: parseFloat(leaderCut[j].replace(/,/g, ''))
                                        };

                                        attendanceData.raids[i+j] = raid;
                                    }
                                }
                            }

                            // attendanceData.timestamp = new Date();
                            // resolve(attendanceData.raids);
                        }
                    }
                );

                // get attendance
                sheets.spreadsheets.values.get({
                    auth: jwtClient,
                    spreadsheetId: sheet.spreadsheetId,
                    range: sheet.attendanceSheet
                }, 
                function (err, response) {
                    if (err) {
                        console.log('The API returned an error: ' + err);
                    } else {
                        let data = [];
                        response.data.values.map((row) => {
                            if (row[0]) {
                                let playerAttendance = {
                                    player: row[0],
                                    raids: []
                                }

                                for (i=1; i<attendanceData.raids.length; i++) {
                                    if (row[i]) {
                                        playerAttendance.raids.push(attendanceData.raids[i]);
                                    }
                                }

                                attendanceData.playerAttendance.push(playerAttendance);
                            }
                        });

                        attendanceData.timestamp = new Date();
                        resolve(attendanceData.playerAttendance);
                    }
                }
            );
            } else {
                resolve(attendanceData.raids);
            }
        });
    }
};
