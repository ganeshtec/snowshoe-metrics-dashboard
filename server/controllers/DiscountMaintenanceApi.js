'use strict'

var express = require('express');
var router = express.Router();
var request = require('request');
var getPromotionStatusReport = require('../service/DiscountMaintenanceService')

var config;

if (process.env.config) {
    config = JSON.parse(process.env.config);
} else {
    var configJson = require('../../config/config.json');
    config = configJson.config;
}

/* GET requests listing. */
router.get('/fetchData/', function (req, res, next) {

    var promise  = getPromotionStatusReport();

    promise.then(function(data) {
        res.send(data);
    },function(err) {
        console.log(err);
        res.status(500).send("Failed to retrieve Markdown Service stats");
    });

});

module.exports = router;