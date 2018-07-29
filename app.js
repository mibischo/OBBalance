if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const cluster = require('cluster');
const sheetsapi = require('./OBBalance.server/sheetsapi/sheetsapi.js');

if (cluster.isMaster && process.env.NODE_ENV === 'production') {

    console.log('Application running, forking!');
    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < 2; i += 1) {
        cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', function (worker) {

        // Replace the dead worker, we're not sentimental
        console.log('Worker %d died :(', worker.id);
        cluster.fork();

    });

    sheetsapi.getSheetData();
    setInterval(function () {
        sheetsapi.getSheetData();
    }, 10000*60*10);
} else {
    if (process.env.NODE_ENV !== 'production') {
        sheetsapi.getSheetData();
        setInterval(function () {
            sheetsapi.getSheetData();
        }, 10000*60*10);
    } else {
        console.log('Worker %d running!', cluster.worker.id);
    }


    var express = require('express');
    const bodyParser = require('body-parser');
    var indexRouter = require('./OBBalance.server/routes/index');

    var app = express();
    var port = process.env.PORT || 3000;

    app.use(express.static('wwwroot'));
    // parse requests of content-type - application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));
    // parse requests of content-type - application/json
    app.use(bodyParser.json());

    app.use('/', indexRouter);

    // starting the server
    app.listen(port, () => {
        console.log('listening on ' + port)
    });
}
