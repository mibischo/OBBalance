const cluster = require('cluster');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

if (cluster.isMaster) {
    console.log('Application running, forking!');
    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', function (worker) {

        // Replace the dead worker, we're not sentimental
        console.log('Worker %d died :(', worker.id);
        cluster.fork();

    });

    setInterval(function () {
        console.log('boo')
    }, 1000);
} else {

    console.log('Worker %d running!', cluster.worker.id);

    var express = require('express');
    const bodyParser = require('body-parser');
    const sheetsapi = require('./OBBalance.server/sheetsapi/sheetsapi.js');
    var indexRouter = require('./OBBalance.server/routes/index');

    var app = express();
    var port = process.env.PORT || 3000;

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
}
