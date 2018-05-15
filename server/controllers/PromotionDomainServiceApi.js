'use strict'

var express = require('express');
var router = express.Router();
var request = require('request');
var monitoring = require('@google-cloud/monitoring');
var projectId = 'hd-pricing-dev';
var fetchPromotionDomainServiceMetrics = require('../service/PromotionDomainService')

// Creates a client
var client = new monitoring.MetricServiceClient({
    keyFilename: 'config/hd-pricing-dev.json',
});

/* GET requests listing. */
router.post('/fetchData/', function (req, res, next) {
    var startDate = new Date(`${req.body.startDate}T00:00:00.000-07:00`);
    var endDate = new Date(`${req.body.endDate}T23:59:59.000-00:00`);
    fetchPromotionDomainServiceMetrics(startDate, endDate).then(function (data) {
        res.send(data);
    }, function (err) {
        console.log(err);
        res.status(500).send("Failed to retrieve Promotion Domain Service metrics");
    })
});

module.exports = router;