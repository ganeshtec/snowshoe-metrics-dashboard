'use strict'

var express = require('express');
var router = express.Router();
var request = require('request');
var monitoring = require('@google-cloud/monitoring');
var projectId = 'hd-pricing-dev';

// Creates a client
var client = new monitoring.MetricServiceClient({
    keyFilename: 'config/hd-pricing-dev.json',
});

/* GET requests listing. */
router.post('/fetchData/', function (req, res, next) {

    var startDate = new Date(`${req.body.startDate}T00:00:00.000-07:00`);
    var endDate = new Date(`${req.body.endDate}T23:59:59.000-07:00`);
    var dateDifference = (endDate - startDate) / 1000;

    console.log(dateDifference, '####');

    // Prepares the time series request
    const request = {
        name: client.projectPath(projectId),
        filter: 'metric.type= "logging.googleapis.com/user/enterprise-pricing-promotion-domain-service-calls"',
        interval: {
            startTime: {seconds: startDate.getTime() / 1000},
            endTime: {seconds: endDate.getTime() / 1000}
        },
        aggregation: {
            alignmentPeriod: {seconds: dateDifference},
            //crossSeriesReducer: 'REDUCE_SUM',
            perSeriesAligner: 'ALIGN_SUM'
        },
    };

    // Writes time series data
    client.listTimeSeries(request)
        .then(responses => {
            var resources = responses[0];
            for (let i = 0; i < resources.length; i += 1) {
                if (resources[i].points != null) {
                    resources[i].points.forEach(function (point) {
                        console.log("startTime=" + new Date(point.interval.startTime.seconds * 1000) + " endTime=" + new Date(point.interval.endTime.seconds * 1000) + " count=" + point.value.int64Value);
                    });
                }
            }
        })
        .catch(err => {
            console.error(err);
        });
    promise.then(function (data) {
        res.send(data);
    }, function (err) {
        console.log(err);
        res.status(500).send("Failed to retrieve Promotion Domain Service stats");
    });

});

module.exports = router;