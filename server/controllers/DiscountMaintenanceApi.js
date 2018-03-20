'use strict'

var express = require('express');
var router = express.Router();
var request = require('request');

/* GET requests listing. */
router.get('/status/', function (req, res, next) {

    const config = {
        url: 'http://localhost.homedepot.com:8080/v1/promotionStatus/report',
        headers: {
            'Accept': 'application/json'
        }
    }

    try {
        request.get(config, function (error, response, body) {
            res.send(body);
        });
    }
    catch (err) {
        console.log("Error fetching data");
    }});

module.exports = router;