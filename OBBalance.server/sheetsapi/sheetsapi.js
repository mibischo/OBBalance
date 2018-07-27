const { google } = require('googleapis');
let Promise = require("promise");
const balance = require('../controllers').balance;
const attendance = require('../controllers').attendance;

let isAuthenticated = false;
let jwtClient;
let email = process.env.EMAIL;
let pkey = process.env.PKEY;


let currentSheet = { // old sheet for dev
    spreadsheetId: '1kVsThQ-IrJp0tmWyyBK892dInmUKTmn9gHr2AbzzV1g',
    balanceSheet: 'Balance!B5:J700',
    raidSheet: 'ATD!ZT2:ZX415', // new atd sheet changed columns 
    attendanceSheet: 'ATD!B4:ZQ700'
};

let oldSheet = {
    spreadsheetId: '1kVsThQ-IrJp0tmWyyBK892dInmUKTmn9gHr2AbzzV1g',
    balanceSheet: '18-7_Balance!B5:J700',
    raidSheet: '18-7_OTB!ZU2:ZY415',
    attendanceSheet: '18-7_OTB!B4:ZR700'
}

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

function getBalance(sheetConfig) {
    return new Promise(function (resolve, reject) {
        if (!isAuthenticated) {
            authenticate();
        }

        //Google Sheets API
        let sheets = google.sheets('v4');
        sheets.spreadsheets.values.get({
                auth: jwtClient,
                spreadsheetId: sheetConfig.spreadsheetId,
                range: sheetConfig.balanceSheet
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
                                balance: row[1] !== "" ? parseInt(row[1].replace(/,/g, '')) : 0,
                                paid: row[2] !== "" ? parseInt(row[2].replace(/,/g, '')) : 0,
                                owed: row[3] !== "" ? parseInt(row[3].replace(/,/g, '')) : 0,
                                extra: row[7] !== undefined ? parseInt(row[7].replace(/,/g, '')) : 0,
                                info: row[8] !== undefined ? row[8] : ''
                            };
                            data.push(player);
                        }
                    });
                    resolve(data);
                }
            }
        );
    });
}

function getAttendance(sheetConfig) {
    return new Promise(function (resolve, reject) {
        if (!isAuthenticated) {
            authenticate();
        }

        //Google Sheets API
        let sheets = google.sheets('v4');

        // get raids
        sheets.spreadsheets.values.get({
                auth: jwtClient,
                spreadsheetId: sheetConfig.spreadsheetId,
                range: sheetConfig.raidSheet
            }, 
            function (err, response) {
                if (err) {
                    console.log('The API returned an error: ' + err);
                } else {
                    let raids = [];
                    let cnt = 0;
                    for (i=0; i<response.data.values.length; i+=6) {
                        let names = response.data.values[i];
                        let pot = response.data.values[i+1];
                        let boosters = response.data.values[i+2];
                        let quater = response.data.values[i+3];
                        let raiderCut = response.data.values[i+4];
                        let leaderCut = response.data.values[i+5];

                        for (j=0; j<5; j++) {
                            if (isNaN(response.data.values[i][j]) && response.data.values[i][j] !== undefined) {
                                let raid = {
                                    hash: '',
                                    name: names[j],
                                    pot: parseFloat(pot[j].replace(/,/g, '')),
                                    boosters: parseInt(boosters[j]),
                                    quater: parseFloat(quater[j].replace(/,/g, '')),
                                    raiderCut: parseFloat(raiderCut[j].replace(/,/g, '')),
                                    leaderCut: parseFloat(leaderCut[j].replace(/,/g, ''))
                                };

                                raids[cnt+j] = raid;
                            }
                        }

                        cnt+=5; // 5 raids in a row
                    }

                    // attendanceData.timestamp = new Date();
                    // resolve(attendanceData.raids);

                    // get attendance
                    sheets.spreadsheets.values.get({
                            auth: jwtClient,
                            spreadsheetId: sheetConfig.spreadsheetId,
                            range: sheetConfig.attendanceSheet
                        }, 
                        function (err, response) {
                            if (err) {
                                console.log('The API returned an error: ' + err);
                            } else {
                                let attendance = [];
                                response.data.values.map((row) => {
                                    if (row[0]) {
                                        let playerAttendance = {
                                            player: row[0],
                                            raids: []
                                        }

                                        for (i=1; i<raids.length+1; i++) {
                                            if (row[i]) {
                                                playerAttendance.raids.push(raids[i-1]);
                                            }
                                        }

                                        attendance.push(playerAttendance);
                                    }
                                });
                                resolve(attendance);
                            }
                        }
                    );
                }
            }
        );
    });
}

module.exports = {
    getSheetData() {
        console.log('getting new data from spreadsheet');

        console.log('current balance data');
        getBalance(currentSheet).then(function (result) {
            console.log('new current balance data');
            balance.saveCurrent(result);
        });

        console.log('old balance data');
        getBalance(oldSheet).then(function (result) {
            console.log('new old balance data');
            balance.saveOld(result);
        });

        console.log('current attendance data');
        getAttendance(currentSheet).then(function (result) {
            console.log('new current attendance data');
            attendance.saveCurrent(result);
        });

        console.log('old attendance data');
        getAttendance(oldSheet).then(function (result) {
            console.log('new old attendance data');
            attendance.saveOld(result);
        });
    }
};
