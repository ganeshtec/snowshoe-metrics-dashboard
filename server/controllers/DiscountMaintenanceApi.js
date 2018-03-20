'use strict'

var express = require('express');
var router = express.Router();
var request = require('request');

var config;

if (process.env.config) {
  config = JSON.parse(process.env.config);
} else {
  var configJson = require('../../config/config.json');
  config = configJson.config;
  console.log(config);
}

/* GET requests listing. */
router.get('/status/', function (req, res, next) {

    const options = {
        url: config.discountMaintenanceApi + '/v1/promotionStatus/report',
        headers: {
            'Accept': 'application/json'
        }
    }

    try {
        request.get(options, function (error, response, body) {
            res.send(body);
        });
    }
    catch (err) {
        console.log("Error fetching data");
    }});

module.exports = router;