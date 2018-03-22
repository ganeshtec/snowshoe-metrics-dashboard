'use strict'

var express = require('express');
var router = express.Router();
var request = require('request');
var splunkjs = require('splunk-sdk')
var moment = require('moment')
var processMarkdownSplunkResponse = require('../service/MarkdownService')

// var MarkDownSplunkRequests = require('./service/MarkdownSplunkRequests')

var config;

if (process.env.config) {
    config = JSON.parse(process.env.config);
} else {
    var configJson = require('../../config/config.json');
    config = configJson.config;
}

/* GET requests listing. */
router.get('/fetchData', async function (req, res, next) {
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
                var search = "Markdown"
                var searchQuery = "search index=qa_app_logs sourcetype=app.logs attributes.cf_app_name=MarkdownServiceV2 attributes.cf_space_name=" + config.markdownServiceSplunkEnv


                var now = new Date(),
                    then = new Date(
                        now.getFullYear(),
                        now.getMonth(),
                        now.getDate(),
                        0, 0, 0),
                    diff = now.getTime() - then.getTime();

                var minutesSinceMidnight = Math.round(diff / 60000)

                var searchParams = {
                    earliest_time: `-${minutesSinceMidnight}m`,
                    count: 0
                };

                // Run a oneshot search that returns the job's results
                service.oneshotSearch(
                    searchQuery,
                    searchParams,
                    function (err, results) {
                        var response = processMarkdownSplunkResponse(err, results)
                        res.send(response)
                    }
                );
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
