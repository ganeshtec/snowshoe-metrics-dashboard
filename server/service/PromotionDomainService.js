/**
 * Created by sxa6859 on 5/9/18.
 */
'use strict'
var request = require('request');
var monitoring = require('@google-cloud/monitoring');
var BigQuery = require('@google-cloud/bigquery');
var projectId = 'hd-pricing-dev';
var percentile = require('percentile');

var client = new monitoring.MetricServiceClient({
    keyFilename: 'config/hd-pricing-dev.json',
});

var bigQuery = new BigQuery({
    keyFilename: 'config/hd-pricing-dev.json',
    projectId: projectId
});


var fetchPromotionDomainServiceMetrics = (startDate, endDate) => {
    var totalCalls = getTotalNumberOfCalls(startDate, endDate);
    var onlineCalls = getNumberOfOnlineCalls(startDate, endDate);
    var averageResponseTime = getAverageResponseTime(startDate, endDate);
    var shortestResponseTime = getShortestResponseTime(startDate, endDate);
    var p99ResponseTime = getP99ResponseTime(startDate, endDate);
    var percentageOfCallsMeetingSLA = getPercentageOfCallsMeetingSLA(startDate, endDate);

    return new Promise(function (resolve, reject) {
        return Promise.all([totalCalls, onlineCalls, averageResponseTime, shortestResponseTime, p99ResponseTime, percentageOfCallsMeetingSLA]).then(results => {
            resolve(results);
        }).catch(function (err) {
            reject(err);
        });
    });
};

function getMetric(startDate, endDate, filter, aggregation, description, extractMetric) {

    var request = {
        name: client.projectPath(projectId),
        filter: filter,
        interval: {
            startTime: {seconds: startDate.getTime() / 1000},
            endTime: {seconds: endDate.getTime() / 1000}
        },
        aggregation: aggregation
    };

    return new Promise(function (resolve, reject) {
        client.listTimeSeries(request)
            .then(responses => {
                var resources = responses[0];
                var value = '0';
                if (resources.length > 0 && resources[0].points != null) {
                    value = extractMetric(resources[0].points[0].value);

                }
                var result = {"description": description, "count": value + ' calls'};
                resolve(result);
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
}

function getTotalNumberOfCalls(startDate, endDate) {
    var filter = 'metric.type= "logging.googleapis.com/user/enterprise-pricing-promotion-domain-service-calls"';
    var aggregation = {
        alignmentPeriod: {seconds: (endDate - startDate) / 1000},
        perSeriesAligner: 'ALIGN_SUM'
    };
    var description = "Total Number Of Calls";
    return getMetric(startDate, endDate, filter, aggregation, description, extractInt64Value);
}

function getNumberOfOnlineCalls(startDate, endDate) {
    var filter = 'metric.type= "logging.googleapis.com/user/promotion-domain-service-online-cart-requests"';
    var aggregation = {
        alignmentPeriod: {seconds: (endDate - startDate) / 1000},
        perSeriesAligner: 'ALIGN_SUM'
    };
    var description = "Online Calls";
    return getMetric(startDate, endDate, filter, aggregation, description, extractInt64Value);
}

function getAverageResponseTime(startDate, endDate) {
    const options = {
        configuration: {
            query: {
                query: `SELECT jsonPayload.response_time FROM [hd-pricing-dev:exported_logs_v2.promotion_domain_svc_access_log_structured_20180510] WHERE timestamp>'2018-05-01T07:00:00.000Z' AND timestamp<'2018-05-11T06:59:59.000Z'`
            }
        }
    };

    return new Promise((resolve, reject) => {
        bigQuery.createJob(options).then(function (data) {
            console.log(data, 'DATA');
            var job = data[0];
            job.getQueryResults().then(function (rows, error) {

                if (error) {
                    console.error(error);
                    reject(error);
                }

                var innerList = rows[0];
                var sum = 0;
                for (var i = 0; i < innerList.length; i++) {
                    sum = sum + parseInt(innerList[i].jsonPayload_response_time);
                }
                resolve({"description": "Average Response Time", "count": Math.round(sum / innerList.length) + ' ms'});
            });
        }).catch(err => {
            console.error(err, 'ERROR');
            reject(err);
        });
    })
};


function getShortestResponseTime(startDate, endDate) {
    const options = {
        configuration: {
            query: {
                query: `SELECT min(jsonPayload.response_time) FROM [hd-pricing-dev:exported_logs_v2.promotion_domain_svc_access_log_structured_20180510] WHERE timestamp > '2018-05-01T07:00:00.000Z' AND timestamp < '2018-05-11T06:59:59.000Z'`
            }
        }
    };

    return new Promise((resolve, reject) => {
        bigQuery.createJob(options).then(function (data) {
            var job = data[0];
            job.getQueryResults().then(function (rows, error) {
                if (error) {
                    console.error(error);
                    reject(error);
                }
                var innerList = rows[0];
                resolve({"description": "Shortest Response Time", "count": innerList[0].f0_ + ' ms'});
            });
        }).catch(err => {
            console.error(err, 'ERROR calling Big Query');
            reject(err);
        });
    })
}

function getP99ResponseTime(startDate, endDate) {


    var timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    const options = {
        configuration: {
            query: {
                query: `SELECT jsonPayload.response_time FROM [hd-pricing-dev:exported_logs_v2.promotion_domain_svc_access_log_structured_20180510] WHERE timestamp>'2018-05-01T07:00:00.000Z' AND timestamp<'2018-05-11T06:59:59.000Z' `
            }
        }
    };

    return new Promise((resolve, reject) => {
        bigQuery.createJob(options).then(function (data) {
            var job = data[0];
            job.getQueryResults().then(function (rows, error) {
                if (error) {
                    console.error(error);
                    reject(error);
                }
                var innerList = rows[0];
                resolve({
                    "description": "99 Percentile Response Time",
                    "count": innerList[0].jsonPayload_response_time + " ms"
                });
            });
        }).catch(err => {
            console.error(err, 'ERROR calling Big Query');
            reject(err);
        });
    })
}

function getPercentageOfCallsMeetingSLA(startDate, endDate) {

    var timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    var queryResults = 0;
    var queryResultsTwo = 0;

    var callsMeetingSLAPromises = [];
    var allCallsPromises = [];

    var numberOfCallsMeetingSLA = 0;
    var numberOfAllCalls = 0;

    var subString = startDate.toISOString().substring(0, 10);
    var stringToQuery = subString.replace(/-/g, '');

    return new Promise((resolve, reject) => {
        for (var i = 0; i < diffDays; i++) {

            const options = {
                configuration: {
                    query: {
                        query: `SELECT count(jsonPayload.response_time) FROM [hd-pricing-dev:exported_logs_v2.promotion_domain_svc_access_log_structured_${stringToQuery}] WHERE timestamp > '${startDate.toISOString()}' AND jsonPayload.response_time < '200'`
                    }
                }
            };

            const optionsTwo = {
                configuration: {
                    query: {
                        query: `SELECT count(jsonPayload.response_time) FROM [hd-pricing-dev:exported_logs_v2.promotion_domain_svc_access_log_structured_${stringToQuery}] WHERE timestamp>'${startDate.toISOString()}'`
                    }
                }
            };

            var callsMeetingSLA = extractBigQueryDataForCalls(options, queryResults);
            callsMeetingSLAPromises.push(callsMeetingSLA);

            var totalNumberOfCalls = extractBigQueryDataForCalls(optionsTwo, queryResultsTwo);
            allCallsPromises.push(totalNumberOfCalls);

            startDate.setDate(startDate.getDate() + 1);
        }
        var numberOfCallsMeetingSLAPromise = Promise.all(callsMeetingSLAPromises).then(function (values) {
            for (var i = 0; i < values.length; i++) {
                numberOfCallsMeetingSLA = numberOfCallsMeetingSLA + values[i]
            }
            return numberOfCallsMeetingSLA;
        }).catch(function (error) {
            reject(error);
        });

        var numberOfAllCallsPromise = Promise.all(allCallsPromises).then(function (values) {
            for (var i = 0; i < values.length; i++) {
                numberOfAllCalls = numberOfAllCalls + values[i]
            }
            return numberOfAllCalls;
        }).catch(function (error) {
            reject(error);
        });

        Promise.all([numberOfCallsMeetingSLAPromise, numberOfAllCallsPromise]).then(function (data) {
            resolve({
                "description": "% Of calls meeting SLA",
                "count": Math.round((data[0] / data[1] * 10000) / 100) + ' %'
            });
        }).catch(function (error) {
            reject(error);
        })
    });
}


var extractInt64Value = function (point) {
    return point.int64Value;
};

var extractDoubleValue = function (point) {
    return point.doubleValue;
};

async function extractBigQueryDataForCalls(options, queryResults) {
    console.log(options.configuration.query.query, '****OPTIONS****')
    var createJob = await bigQuery.createJob(options);
    var job = createJob[0];
    var rows = await job.getQueryResults();
    var innerList = rows[0];
    queryResults = queryResults + innerList[0].f0_;

    return queryResults;
}

module.exports = fetchPromotionDomainServiceMetrics;