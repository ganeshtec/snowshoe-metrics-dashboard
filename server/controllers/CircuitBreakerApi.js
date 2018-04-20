'use strict'
var express = require('express');
var router = express.Router();
var splunkjs = require('splunk-sdk')
var processCircuitBreakerSplunkResponse = require('../service/CircuitBreakerService')
var uniquePromoIdProcessor = require('../service/UniquePromoIdProcessor')

var config;

if (process.env.config) {
    config = JSON.parse(process.env.config);
} else {
    var configJson = require('../../config/config.json');
    config = configJson.config;
}

/* GET requests listing. */
router.post('/fetchData', async function (req, res, next) {
    var start_time = new Date().getTime();
    try {

        var service = new splunkjs.Service({
            username: "showshoe",
            password: "showshoe",
            scheme: "https",
            hostname: "Splunkapi.homedepot.com",
            host: "Splunkapi.homedepot.com",
            token: "YnhiMjA1NDpDaGFybGVzYjIzNCE=",
            port: "8089",
            version: "5.0"
        })
        service.login(function (err, success) {
            if (success) {
                var circuitBreakerQuery = "search " + config.circuitBreakerServiceSplunkQuery;
                var circuitBreakerPromoCountQuery = "search " + config.circuitBreakerPromoCountQuery
                var searchParams = {
                    earliest_time: `${req.body.startDate}T00:00:00.000-07:00`,
                    latest_time: `${req.body.endDate}T23:59:59.000-07:00`,
                    count: 0
                };

                // Run a oneshot search that returns the job's results
                var circuitBreakerData = new Promise(function(resolve, reject) {
                    service.oneshotSearch(
                        circuitBreakerQuery,
                        searchParams,
                        function (err, results) {
                            var circuitBreakerResponseData = processCircuitBreakerSplunkResponse(err, results)
                            resolve(circuitBreakerResponseData)      
                        }
                    );
                });

                var circuitBreakerPromoData = new Promise(function(resolve, reject){
                    service.oneshotSearch(
                        circuitBreakerPromoCountQuery,
                        searchParams,
                        function (err, results) {
                            var circuitBreakerPromoData = uniquePromoIdProcessor(err, results)
                            resolve(circuitBreakerPromoData)
                        }
                    )
                })
                Promise.all([circuitBreakerData, circuitBreakerPromoData]).then((response) => {
                    var resultSet = []
                    resultSet = resultSet.concat(response[0], response[1])
                    res.send(resultSet)
                })
            }
            else {
                console.log("Error connecting to Splunk")
                res.status(500).send('Failed to retrieve Markdown Service stats')
            }
        })


    } catch (err) {
        console.log(err)
        res.status(500).send('Failed to retrieve Markdown Service stats')
    }

});

module.exports = router;
