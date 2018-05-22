'use strict'

var express = require('express');
var router = express.Router();
var request = require('request');
require('../service/DiscountMaintenanceService')

var config;

if (process.env.config) {
    config = JSON.parse(process.env.config);
} else {
    var configJson = require('../../config/config.json');
    config = configJson.config;
}

/* GET requests listing. */
router.get('/fetchPromotionData/', function (req, res, next) {

    var promise  = getPromotionStatusReport();

    promise.then(function(data) {
        res.send(data);
    },function(err) {
        console.log(err);
        res.status(500).send("Failed to retrieve Markdown Service stats");
    });

});

router.get('/fetchPromoQualifiers/', function (req, res, next) {

    var promise  = getQualifiersForActivePromotions();

    promise.then(function(data) {
        res.send(data);
    },function(err) {
        console.log(err);
        res.status(500).send("Failed to retrieve Qualifiers stats");
    });

});

router.get('/fetchPromoRewards/', function (req, res, next) {

    var promise  = getRewardsForActivePromotions();

    promise.then(function(data) {
        res.send(data);
    },function(err) {
        console.log(err);
        res.status(500).send("Failed to retrieve Rewards stats");
    });

});

router.get('/fetchPromoAttributes/', function (req, res, next) {

    var promise  = getAttributesForActivePromotions();

    promise.then(function(data) {
        res.send(data);
    },function(err) {
        console.log(err);
        res.status(500).send("Failed to retrieve Attributes stats");
    });

});

router.get('/fetchPromoCreators/', function (req, res, next) {

    var promise  = getCreatorsForActivePromotions();

    promise.then(function(data) {
        res.send(data);
    },function(err) {
        console.log(err);
        res.status(500).send("Failed to retrieve Attributes stats");
    });

});

module.exports = router;