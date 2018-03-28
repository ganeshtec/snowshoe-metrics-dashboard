processCircuitBreakerSplunkResponse = (error, results) => {
    if (error) {
        console.log("ERROR Fetching Splunk Data", error)
    }
    var rows = results.rows;
    var values = rows[0]

    var results = [
        {
            description: "Total Calls Generated",
            count: values[3] + " calls"
        },
        {
            description: "Average Response Time: ",
            count: Math.round(values[2]) + " ms"
        },
        {
            description: "Shortest Response Time: ",
            count: values[1] + " ms"
        },
        {
            description: "Longest Response Time: ",
            count: values[0] + " ms"
        },
        {
            description: "Percentage of calls meeting SLA: ",
            count: Math.round((values[4] / values[3]) * 10000)/100 + " %"
        }
    ]
    return (results)
}

module.exports = processCircuitBreakerSplunkResponse;