/**
 * Created by sxa6859 on 5/9/18.
 */
'use strict'

var request = require('request');
var monitoring = require('@google-cloud/monitoring');
var projectId = 'hd-pricing-dev';

// Creates a client
var client = new monitoring.MetricServiceClient({
    keyFilename: 'config/hd-pricing-dev.json',
});
var fetchPromotionDomainServiceMetrics = (startDate, endDate) => {
    var totalCalls = getTotalNumberOfCalls(startDate, endDate);
    var onlineCalls = getNumberOfOnlineCalls(startDate, endDate);
    var averageResponseTime = getAverageResponseTime(startDate,endDate);
    var shortestResponseTime = getShortestResponseTime(startDate, endDate);
    var p99ResponseTime = getP99ResponseTime(startDate, endDate);
    var percentageOfCallsMeetingSLA = getPercentageOfCallsMeetingSLA(startDate, endDate);

    return new Promise(function (resolve, reject) {
        return Promise.all([totalCalls, onlineCalls,averageResponseTime]).then(results => {
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
    // Writes time series data

    return new Promise(function (resolve, reject) {
        client.listTimeSeries(request)
            .then(responses => {
                var resources = responses[0];
                var value = '0';
                if (resources.length > 0 && resources[0].points != null) {
                    value = extractMetric(resources[0].points[0].value);

                }
                var result = {"description": description, "count": value};
                resolve(result);
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
}

var extractInt64Value = function (point) {
    return point.int64Value;
};

var extractDoubleValue = function (point) {
    return point.doubleValue;
};




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

function getAverageResponseTime(startDate,endDate){
    var filter = 'metric.type= "logging.googleapis.com/user/enterprise-pricing-promotion-domain-service-cartResponseTime"';
    var aggregation = {
        alignmentPeriod: {seconds: (endDate - startDate) / 1000},
        perSeriesAligner: 'ALIGN_SUM',
        crossSeriesReducer: 'REDUCE_MEAN'
    };
    var description = "Average Response Time";
    return getMetric(startDate, endDate, filter, aggregation, description, extractDoubleValue);
}

function getShortestResponseTime(startDate,endDate){
    var filter = 'metric.type= "logging.googleapis.com/user/enterprise-pricing-promotion-domain-service-cartResponseTime"';
    var aggregation = {
        alignmentPeriod: {seconds: (endDate - startDate) / 1000},
        perSeriesAligner: 'ALIGN_PERCENTILE_99'
    };
    var description = "Shortest Response Time";
    return getMetric(startDate, endDate, filter, aggregation, description, extractDoubleValue);
}

function getP99ResponseTime(startDate,endDate){
    var filter = 'metric.type= "logging.googleapis.com/user/enterprise-pricing-promotion-domain-service-cartResponseTime"';
    var aggregation = {
        alignmentPeriod: {seconds: (endDate - startDate) / 1000},
        perSeriesAligner: 'ALIGN_PERCENTILE_99'
    };
    var description = "99 Percentile Response Time";
    return getMetric(startDate, endDate, filter, aggregation, description, extractDoubleValue);
}

function getPercentageOfCallsMeetingSLA(startDate,endDate){
    var filter = 'metric.type= "logging.googleapis.com/user/enterprise-pricing-promotion-domain-service-cartResponseTime"';
    var aggregation = {
        alignmentPeriod: {seconds: (endDate - startDate) / 1000},
        perSeriesAligner: 'ALIGN_PERCENTILE_99'
    };
    var description = "% of calls meeting SLA";
    return getMetric(startDate, endDate, filter, aggregation, description, extractDoubleValue);
}

module.exports = fetchPromotionDomainServiceMetrics;