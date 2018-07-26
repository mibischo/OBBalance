const { google } = require('googleapis');
let Promise = require("promise");
// let a = require("../config/pkey.json");

let isAuthenticated = false;
let jwtClient;
let email = process.env.EMAIL;
let pkey = process.env.PKEY;
// console.log(email);
// console.log(pkey);
// let email = a.client_email;
// let pkey = a.private_key;
// let sheet = { // new sheet
//     spreadsheetId: '1gA3EqP8ALjjdwpNCA3uxXro0g0BlHoKqR4nTxi_IqA0',
//     balanceSheet: 'Balance!B5:E700',
//     raidSheet: 'OTB!ZU2:ZY415',
//     attendanceSheet: ''
// };
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

let currentBalanceData = {
    timestamp: new Date(),
    data: [],
    loading: false
};

let currentAttendanceData = {
    timestamp: new Date(),
    playerAttendance: [],
    loading: false
};

let oldBalanceData = {
    timestamp: new Date(),
    data: [],
    loading: false
};

let oldAttendanceData = {
    timestamp: new Date(),
    playerAttendance: [],
    loading: false
};

function getBalance(sheetConfig) {
    return new Promise(function (resolve, reject) {
        if (!isAuthenticated) {
            authenticate();
        }

        //Google Sheets API
        let sheets = google.sheets('v4');
        // sheets.spreadsheets.get({
        //         auth: jwtClient,
        //         spreadsheetId: sheetConfig.spreadsheetId,
        //         // range: sheetConfig.balanceSheet
        //     }, 
        //     function (err, response) {
        //         response.data.sheets.forEach(element => {
        //             console.log(element.properties);
        //         });
        //     }
        // );
        console.log(sheetConfig.balanceSheet);

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

                                        for (i=1; i<raids.length; i++) {
                                            if (row[i]) {
                                                playerAttendance.raids.push(raids[i]);
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
    getCurrentBalanceData: function() {
        return new Promise(function (resolve, reject) {
            let now = new Date();
            let diff = now - currentBalanceData.timestamp;
            let diffMins = Math.round(((diff % 86400000) % 3600000) / 60000);
            if ((diffMins > 10 || currentBalanceData.data.length == 0) && !currentBalanceData.loading) {
                currentBalanceData.loading = true;
                getBalance(currentSheet).then(function (result) {
                    currentBalanceData.timestamp = new Date();
                    currentBalanceData.data = result;
                    console.log('new data - current balance: ' + currentBalanceData.timestamp);
                    currentBalanceData.loading = false
                    resolve(currentBalanceData.data);
                });
            } else {
                console.log('old data - current balance: ' + currentBalanceData.timestamp);
                resolve(currentBalanceData.data);
            }
        });
    },

    getOldBalanceData: function() {
        return new Promise(function (resolve, reject) {
            let now = new Date();
            let diff = now - oldBalanceData.timestamp;
            let diffMins = Math.round(((diff % 86400000) % 3600000) / 60000);
            if ((diffMins > 10 || oldBalanceData.data.length == 0) && !oldBalanceData.loading) {
                oldBalanceData.loading = true;
                getBalance(oldSheet).then(function (result) {
                    oldBalanceData.timestamp = new Date();
                    oldBalanceData.data = result;
                    console.log('new data - old balance: ' + oldBalanceData.timestamp);
                    oldBalanceData.loading = false
                    resolve(oldBalanceData.data);
                });
            } else {
                console.log('old data - old balance: ' + oldBalanceData.timestamp);
                resolve(oldBalanceData.data);
            }
        });
    },

    getCurrentAttendanceData: function () {
        return new Promise(function (resolve, reject) {
            let now = new Date();
            let diff = now - currentAttendanceData.timestamp;
            let diffMins = Math.round(((diff % 86400000) % 3600000) / 60000);
            if ((diffMins > 10 || currentAttendanceData.playerAttendance.length === 0) && !currentAttendanceData.loading) {
                currentAttendanceData.loading = true;
                getAttendance(currentSheet).then(function (result) {
                    currentAttendanceData.timestamp = new Date();
                    currentAttendanceData.playerAttendance = result;
                    console.log('new data - current attendance: ' + currentAttendanceData.timestamp);
                    currentAttendanceData.loading = false;
                    resolve(currentAttendanceData.playerAttendance);
                });
            } else {
                console.log('old data - current attendance: ' + currentAttendanceData.timestamp);
                resolve(currentAttendanceData.playerAttendance);
            }

        });
    },

    getOldAttendanceData: function () {
        return new Promise(function (resolve, reject) {
            let now = new Date();
            let diff = now - oldAttendanceData.timestamp;
            let diffMins = Math.round(((diff % 86400000) % 3600000) / 60000);
            if ((diffMins > 10 || oldAttendanceData.playerAttendance.length === 0) && !oldAttendanceData.loading) {
                oldAttendanceData.loading = true;
                getAttendance(oldSheet).then(function (result) {
                    oldAttendanceData.timestamp = new Date();
                    oldAttendanceData.playerAttendance = result;
                    console.log('new data - old attendance: ' + oldAttendanceData.timestamp);
                    oldAttendanceData.loading = false;
                    resolve(oldAttendanceData.playerAttendance);
                });
            } else {
                console.log('old data - old attendance: ' + oldAttendanceData.timestamp);
                resolve(oldAttendanceData.playerAttendance);
            }

        });
    }
};
