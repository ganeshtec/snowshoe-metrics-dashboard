/**
 * Created by sxa6859 on 5/9/18.
 */
'use strict';
let request = require('request');
let monitoring = require('@google-cloud/monitoring');
let BigQuery = require('@google-cloud/bigquery');
let projectId = 'hd-pricing-dev';
let percentile = require('percentile');

const client = new monitoring.MetricServiceClient({
    keyFilename: 'config/hd-pricing-dev.json',
});

const bigQuery = new BigQuery({
    keyFilename: 'config/hd-pricing-dev.json',
    projectId: projectId
});

let fetchPromotionDomainServiceMetrics = (startDate, endDate) => {
    let totalCalls = getTotalNumberOfCalls(startDate, endDate);
    let onlineCalls = getNumberOfOnlineCalls(startDate, endDate);
    let onlineCallsWithDiscountsReturned = getCountOfOnlineCallsWithDiscountReturned(startDate, endDate);
    let percentageOfCallsWithOnlineDiscountsReturned = getPercentageOfOnlineCallsWithDiscountReturned(onlineCallsWithDiscountsReturned, onlineCalls);
    let averageResponseTime = getAverageResponseTime(startDate, endDate);
    let shortestResponseTime = getShortestResponseTime(startDate, endDate);
    let p99ResponseTime = getP99ResponseTime(startDate, endDate);
    let percentageOfCallsMeetingSLA = getPercentageOfCallsMeetingSLA(startDate, endDate);


    return new Promise(function (resolve, reject) {
        return Promise.all([totalCalls, onlineCalls, onlineCallsWithDiscountsReturned, percentageOfCallsWithOnlineDiscountsReturned, averageResponseTime, shortestResponseTime,
            p99ResponseTime, percentageOfCallsMeetingSLA]).then(results => {
            resolve(results);
        }).catch(function (err) {
            reject(err);
        });
    });
};

function getMetric(startDate, endDate, filter, aggregation, description, extractMetric) {

    let request = {
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
                let resources = responses[0];
                let value = '0';
                if (resources.length > 0 && resources[0].points != null) {
                    value = extractMetric(resources[0].points[0].value);

                }
                let result = {"description": description, "count": value + ' calls'};
                resolve(result);
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
}

function getTotalNumberOfCalls(startDate, endDate) {
    const filter = 'metric.type= "logging.googleapis.com/user/enterprise-pricing-promotion-domain-service-calls"';
    let aggregation = {
        alignmentPeriod: {seconds: (endDate - startDate) / 1000},
        perSeriesAligner: 'ALIGN_SUM',
        crossSeriesReducer: 'REDUCE_SUM'
    };
    let description = "Total Number Of Calls";
    return getMetric(startDate, endDate, filter, aggregation, description, extractInt64Value);
}

function getNumberOfOnlineCalls(startDate, endDate) {
    const filter = 'metric.type= "logging.googleapis.com/user/promotion-domain-service-online-cart-requests"';
    let aggregation = {
        alignmentPeriod: {seconds: (endDate - startDate) / 1000},
        perSeriesAligner: 'ALIGN_SUM',
        crossSeriesReducer: 'REDUCE_SUM'
    };
    let description = "Online Calls";
    return getMetric(startDate, endDate, filter, aggregation, description, extractInt64Value);
}

function getCountOfOnlineCallsWithDiscountReturned(startDate, endDate) {
    const filter = 'metric.type= "logging.googleapis.com/user/promotion-domain-service-online-cart-responses"';
    let aggregation = {
        alignmentPeriod: {seconds: (endDate - startDate) / 1000},
        perSeriesAligner: 'ALIGN_SUM',
        crossSeriesReducer: 'REDUCE_SUM'
    };
    let description = "Online Calls with discounts returned";
    return getMetric(startDate, endDate, filter, aggregation, description, extractInt64Value);
}

function getPercentageOfOnlineCallsWithDiscountReturned(onlineCallsWithDiscountsReturned, onlineCalls) {
    return new Promise(function (resolve, reject) {
        return Promise.all([onlineCallsWithDiscountsReturned, onlineCalls]).then(values => {
            let result = {
                "description": "% Of Online calls with with discount returned",
                "count": values[1].count == '0 calls' ? '0 %' : (values[0].count / values[1].count) * 100 + ' %'
            };
            resolve(result);
        }).catch(function (err) {
            reject(err);
        });
    });
}

function getAverageResponseTime(startDate, endDate) {
    let startDateLocal = new Date(startDate.getTime());

    let queryResults = [];
    let responseTimePromises = [];

    return new Promise((resolve, reject) => {
        let timeDiff = Math.abs(endDate.getTime() - startDateLocal.getTime());
        let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        for (let i = 0; i < diffDays; ++i) {
            try {
                let subString = startDateLocal.toISOString().substring(0, 10);
                let stringToQuery = subString.replace(/-/g, '');

                let options = {
                    configuration: {
                        query: {
                            query: `SELECT jsonPayload.response_time FROM [hd-pricing-dev:exported_logs_v2.promotion_domain_svc_access_log_structured_${stringToQuery}] WHERE timestamp>'${startDateLocal.toISOString()}'`
                        }
                    }
                };

                let p99ResponseTime = extractBigQueryDataForColumnWithResponseTime(options, queryResults);
                responseTimePromises.push(p99ResponseTime);
                startDateLocal.setDate(startDateLocal.getDate() + 1);
            } catch (error) {
                console.log(error, "error in getP99ResponseTime");
            }
        }

        Promise.all(responseTimePromises).then(function (values) {

            let allResponseTimes = values[0];


            let sum = 0;
            for (let i = 0; i < allResponseTimes.length; i++) {
                sum = sum + parseInt(allResponseTimes[i]);
            }
            resolve({
                "description": "Average Response Time",
                "count": Math.round(sum / allResponseTimes.length) + ' ms'
            });
        }).catch(function (error) {
            reject(error);
        })
    })
};


function getShortestResponseTime(startDate, endDate) {
    let startDateLocal = new Date(startDate.getTime());

    let queryResults = [];
    let responseTimePromises = [];

    return new Promise((resolve, reject) => {
        let timeDiff = Math.abs(endDate.getTime() - startDateLocal.getTime());
        let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        for (let i = 0; i < diffDays; ++i) {
            try {
                let subString = startDateLocal.toISOString().substring(0, 10);
                let stringToQuery = subString.replace(/-/g, '');

                let options = {
                    configuration: {
                        query: {
                            query: `SELECT min(jsonPayload.response_time) FROM [hd-pricing-dev:exported_logs_v2.promotion_domain_svc_access_log_structured_${stringToQuery}] WHERE timestamp>'${startDateLocal.toISOString()}'`
                        }
                    }
                };

                let shortestResponseTime = extractBigQueryDataForColumnWithF0(options, queryResults);
                responseTimePromises.push(shortestResponseTime);
                startDateLocal.setDate(startDateLocal.getDate() + 1);
            } catch (error) {
                console.log(error, "error in getShortestResponseTime");
            }
        }

        Promise.all(responseTimePromises).then(function (values) {

            let valuesInInt = [];
            for (let i = 0; i < values.length; i++) {
                valuesInInt.push(parseInt(values[i]));
            }

            resolve({
                "description": "Shortest Response Time",
                "count": Math.min(...valuesInInt) + ' ms'
            });
        }).catch(function (error) {
            reject(error);
        })
    })
}

function getP99ResponseTime(startDate, endDate) {


    let startDateLocal = new Date(startDate.getTime());

    let queryResults = [];
    let responseTimePromises = [];

    return new Promise((resolve, reject) => {
        let timeDiff = Math.abs(endDate.getTime() - startDateLocal.getTime());
        let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        for (let i = 0; i < diffDays; ++i) {
            try {
                let subString = startDateLocal.toISOString().substring(0, 10);
                let stringToQuery = subString.replace(/-/g, '');

                let options = {
                    configuration: {
                        query: {
                            query: `SELECT FLOAT((NTH(98,QUANTILES(FLOAT(jsonPayload.response_time),100))))*1000 FROM [hd-pricing-dev:exported_logs_v2.promotion_domain_svc_access_log_structured_${stringToQuery}] WHERE timestamp>'${startDateLocal.toISOString()}'`
                        }
                    }
                };

                let p99ResponseTime = extractBigQueryDataForColumnWithF0(options, queryResults);
                responseTimePromises.push(p99ResponseTime);
                startDateLocal.setDate(startDateLocal.getDate() + 1);
            } catch (error) {
                console.log(error, "error in getP99ResponseTime");
            }
        }

        Promise.all(responseTimePromises).then(function (values) {

            resolve({
                "description": "P99 Response Time",
                "count": values[0] + ' ms'
            });
        }).catch(function (error) {
            reject(error);
        })
    })
}

function getPercentageOfCallsMeetingSLA(startDate, endDate) {


    let startDateLocal = new Date(startDate.getTime());
    let queryResults = 0;
    let queryResultsTwo = 0;

    let callsMeetingSLAPromises = [];
    let allCallsPromises = [];

    let numberOfCallsMeetingSLA = 0;
    let numberOfAllCalls = 0;

    return new Promise((resolve, reject) => {
        let timeDiff = Math.abs(endDate.getTime() - startDateLocal.getTime());
        let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        for (let i = 0; i < diffDays; i++) {
            try {
                let subString = startDateLocal.toISOString().substring(0, 10);
                let stringToQuery = subString.replace(/-/g, '');

                const options = {
                    configuration: {
                        query: {
                            query: `SELECT count(jsonPayload.response_time) FROM [hd-pricing-dev:exported_logs_v2.promotion_domain_svc_access_log_structured_${stringToQuery}] WHERE timestamp > '${startDateLocal.toISOString()}' AND jsonPayload.response_time < '200'`
                        }
                    }
                };

                const optionsTwo = {
                    configuration: {
                        query: {
                            query: `SELECT count(jsonPayload.response_time) FROM [hd-pricing-dev:exported_logs_v2.promotion_domain_svc_access_log_structured_${stringToQuery}] WHERE timestamp>'${startDateLocal.toISOString()}'`
                        }
                    }
                };

                let callsMeetingSLA = extractBigQueryDataForColumnWithF0(options, queryResults);
                callsMeetingSLAPromises.push(callsMeetingSLA);

                let totalNumberOfCalls = extractBigQueryDataForColumnWithF0(optionsTwo, queryResultsTwo);
                allCallsPromises.push(totalNumberOfCalls);

                startDateLocal.setDate(startDateLocal.getDate() + 1);
            } catch (error) {
                console.log(error, 'error in getPercentageOfCallsMeetingSLA');
            }

        }
        let numberOfCallsMeetingSLAPromise = Promise.all(callsMeetingSLAPromises).then(function (values) {
            for (let i = 0; i < values.length; i++) {
                numberOfCallsMeetingSLA = numberOfCallsMeetingSLA + values[i]
            }
            return numberOfCallsMeetingSLA;
        }).catch(function (error) {
            reject(error);
        });

        let numberOfAllCallsPromise = Promise.all(allCallsPromises).then(function (values) {
            for (let i = 0; i < values.length; i++) {
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


let extractInt64Value = function (point) {
    return point.int64Value;
};

async function extractBigQueryDataForColumnWithF0(options, queryResults) {
    let createJob = await bigQuery.createJob(options);
    let job = createJob[0];
    let rows = await job.getQueryResults();
    let innerList = rows[0];
    queryResults = queryResults + innerList[0].f0_;

    return queryResults;
}

async function extractBigQueryDataForColumnWithResponseTime(options, queryResults) {
    let createJob = await bigQuery.createJob(options);
    let job = createJob[0];
    let rows = await job.getQueryResults();
    let innerList = rows[0];
    for (let i = 0; i < innerList.length; i++) {
        queryResults.push(innerList[i].jsonPayload_response_time)
    }
    return queryResults;
}

module.exports = fetchPromotionDomainServiceMetrics;