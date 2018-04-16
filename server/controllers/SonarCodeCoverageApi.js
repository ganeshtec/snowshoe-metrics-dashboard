'use strict'

var express = require('express');
var router = express.Router();
var request = require('request');
var sonarqubeScanner = require('sonarqube-scanner');
var processSonarCodeCoverageSonarResponse = require('../service/SonarCodeCoverageService')

var config;

if (process.env.config) {
    config = JSON.parse(process.env.config);
} else {
    var configJson = require('../../config/config.json');
    config = configJson.config;
}

/* GET requests listing. */
router.get('/fetchData', async function (req, res, next) {

    const applicationNames = [
        {
            key: 'Disc-Main-Ext-WS',
            description: "Discount Maintenance API",
            count: ''
        }, {
            key: 'discount-segmentation-api',
            description: "Discount Segment API: ",
            count: ''
        }, {
            key: 'com.homedepot.mm.pc.promotion:PromotionService',
            description: "Promotion Domain Service: ",
            count: ''
        }, {
            description: "Discount Engine: ",
            count: '-'
        }, {
            key: 'MarkdownService',
            description: "Markdown Service: ",
            count: ''
        }, {
            key: 'Disc-Eng-Stores-API',
            description: "Discount Stores API: ",
            count: ''
        }, {
            key: 'promotion-item-cascade',
            description: "Promotion Item Casecade: ",
            count: ''
        }, {
            key: 'Disc-customer-coupon-transportation-vehicle',
            description: "CCTV: ",
            count: ''
        }, {
            description: "Discount Data Service: ",
            count: '-'
        }
    ]
    var callCount = 0;
    applicationNames.forEach(app => {
        if (app.key) {
            callCount++;
            const options = {
                url: config.sonarCodeCoverageApi + "/api/measures/component",
                qs: {
                    componentKey: app.key,
                    metricKeys: 'coverage'
                },
                headers: {
                    'Accept': 'application/json'
                }
            }
            try {
                request.get(options, function (error, response, body) {
                    processSonarCodeCoverageSonarResponse(error, body, app);
                    if (--callCount == 0) {
                        res.send(applicationNames);
                    }
                });
            }
            catch (err) {
                console.log(err)
                if (--callCount == 0) {
                    res.send(applicationNames);
                }
            }
        }
    });

});

module.exports = router;
