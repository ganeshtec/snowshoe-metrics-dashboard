var numberWithCommas = require('../utils/FormatNumbers')

processCircuitBreakerSplunkResponse = (error, results) => {
    if (error) {
        console.log("ERROR Fetching Splunk Data", error)
    }
    var rows = results.rows;
    var values = rows[0]

    var output = [
        {
            description: "--------CIRCUIT BREAKER METRICS--------"
        },
        {
            description: "Total Calls Generated",
            count: numberWithCommas(values[0]) + " calls"
        },
        {
            description: "Circuit Breaker Average Response Time: ",
            count: numberWithCommas(Math.round(values[1])) + " ms"
        },
        {
            description: "Circuit Breaker Shortest Response Time: ",
            count: numberWithCommas(values[2]) + " ms"
        },
        {
            description: "Circuit Breaker Longest Response Time: ",
            count: numberWithCommas(values[3]) + " ms"
        },
        {
            description: "--------CLOUD METRICS--------"
        },
        {
            description: "Cloud Average Response Time: ",
            count: numberWithCommas(Math.round(values[6])) + " ms"
        },
        {
            description: "Cloud Shortest Response Time: ",
            count: numberWithCommas(values[7]) + " ms"
        },
        {
            description: "Cloud Longest Response Time: ",
            count: numberWithCommas(values[8]) + " ms"
        },
        {
            description: "--------STORE METRICS--------"
        },
        {
            description: "Store Average Response Time: ",
            count: numberWithCommas(Math.round(values[11])) + " ms"
        },
        {
            description: "Store Shortest Response Time: ",
            count: numberWithCommas(values[12]) + " ms"
        },
        {
            description: "Store Longest Response Time: ",
            count: numberWithCommas(values[13]) + " ms"
        },
        {
            description: "--------SLA METRICS--------"
        },
        {
            description: "Circuit Breaker Percentage of calls meeting SLA: ",
            count: Math.round((values[4] / values[0]) * 10000) / 100 + " %"
        },
        {
            description: "Percentage of Cloud Calls Meeting SLA: ",
            count: Math.round((values[9] / values[5]) * 10000) / 100 + " %"
        },
        {
            description: "Percentage of Store Calls Meeting SLA: ",
            count: Math.round((values[14] / values[10]) * 10000) / 100 + " %"
        },
        {
            description: "Cloud Percentage of Calls w/ Discount Returned: ",
            count: Math.round((values[15] / values[5]) * 10000) / 100 + " %"
        }
    ]
    return (output)
}

module.exports = processCircuitBreakerSplunkResponse;