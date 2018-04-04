processCircuitBreakerSplunkResponse = (error, results) => {
    if (error) {
        console.log("ERROR Fetching Splunk Data", error)
    }
    var rows = results.rows;
    var values = rows[0]

    var results = [
        {
            description: "Total Calls Generated",
            count: values[0] + " calls"
        },
        {
            description: "Average Response Time of Total Calls: ",
            count: Math.round(values[1]) + " ms"
        },
        {
            description: "Shortest Response Time of Total Calls: ",
            count: values[2] + " ms"
        },
        {
            description: "Longest Response Time of Total Calls: ",
            count: values[3] + " ms"
        },
        {
            description: "Percentage of Total Calls Meeting SLA: ",
            count: Math.round((values[4] / values[0]) * 10000)/100 + " %"
        }
        // {
        //     description: "Average Response Time of Cloud Calls: ",
        //     count: Math.round(values[6]) + " ms"
        // },
        // {
        //     description: "Shortest Response Time of Cloud Calls: ",
        //     count: values[7] + " ms"
        // },
        // {
        //     description: "Longest Response Time of Cloud Calls: ",
        //     count: values[8] + " ms"
        // },
        // {
        //     description: "Percentage of Cloud Calls Meeting SLA: ",
        //     count: Math.round((values[9] / values[5]) * 10000)/100 + " %"
        // },
        // {
        //     description: "Cloud Percentage of Calls w/ Discount Returned: ",
        //     count: Math.round((values[10] / values[5]) * 10000)/100 + " %"
        // },
        // {
        //     description: "Average Response Time of Store Calls: ",
        //     count: Math.round(values[12]) + " ms"
        // },
        // {
        //     description: "Shortest Response Time of Store Calls: ",
        //     count: values[13] + " ms"
        // },
        // {
        //     description: "Longest Response Time of Store Calls: ",
        //     count: values[14] + " ms"
        // },
        // {
        //     description: "Percentage of Store Calls Meeting SLA: ",
        //     count: Math.round((values[15] / values[11]) * 10000)/100 + " %"
        // }

    ]
    return (results)
}

module.exports = processCircuitBreakerSplunkResponse;