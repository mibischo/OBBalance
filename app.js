if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

var express = require('express');
const bodyParser = require('body-parser');
const sheetsapi = require('./OBBalance.server/sheetsapi/sheetsapi.js');
var indexRouter = require('./OBBalance.server/routes/index');


// mongo example: https://www.callicoder.com/node-js-express-mongodb-restful-crud-api-tutorial/

var app = express();
var port = process.env.PORT || 3000;
var db;


app.use(express.static('wwwroot'));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse requests of content-type - application/json
app.use(bodyParser.json());

app.use('/', indexRouter);

app.get('/api/currentBalance', (req, res) => {
    sheetsapi.getCurrentBalanceData().then(function (result) {
        res.send(result);
    });
});

app.get('/api/oldBalance', (req, res) => {
    sheetsapi.getOldBalanceData().then(function (result) {
        res.send(result);
    });
});

app.get('/api/currentAttendance', (req, res) => {
    sheetsapi.getCurrentAttendanceData().then(function (result) {
        res.send(result);
    });
});

app.get('/api/oldAttendance', (req, res) => {
    sheetsapi.getOldAttendanceData().then(function (result) {
        res.send(result);
    });
});

// starting the server
app.listen(port, () => {
  console.log('listening on ' + port)
});
