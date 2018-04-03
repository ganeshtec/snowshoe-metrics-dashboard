processMarkdownSplunkResponse = (err, results) => {
    var rawValues = [];
    if (err) {
        console.log("ERROR Fetching Splunk Data", err)
    }
    // Display the results
    var fields = results.fields;
    var rows = results.rows;
    for (var i = 0; i < rows.length; i++) {
        var values = rows[i];
        for (var j = 0; j < values.length; j++) {
            var field = fields[j];
            var value = values[j];
            if (field === "_raw") {
                rawValues.push(value)
            }
        }
    }
    var totalIVPCalls = rawValues.filter((value) => {
        return value.includes("- Time taken to get IVP discounts")
    })

    var totalVPPCalls = rawValues.filter((value) => {
        return value.includes("- Time taken to get VPP discounts")
    })

    var totalGPASCalls = rawValues.filter((value) => {
        return value.includes("- Total time taken to get MSB discounts")
    })

    var totalCalls = rawValues.filter((value) => {
        return value.includes("- Overall time taken to process the discounts for cart items")
    })

    var V2Errors = rawValues.filter((value) => {
        return value.includes("Exception while calculating discounts")
    })

    var IVPErrors = rawValues.filter((value) => {
        return value.includes("- Error while fetching IVP")
    })

    var VPPErrors = rawValues.filter((value) => {
        return value.includes("- Error while fetching VPP")
    })

    var GPASErrors = rawValues.filter((value) => {
        return value.includes("- Error while fetching MSB")
    })

    var manualBids = rawValues.filter((value) => {
        return value.includes("- Time taken to update bid")
    })

    var timesTaken = totalCalls.map((call) => {
        var JSONCall = JSON.parse(call)
        return parseInt(JSONCall.body.split(':')[1])
    })

    var total = timesTaken.reduce((accumulator, number) => {
        return accumulator + number;
    }, 0)

    var cartRequests = rawValues.filter((value) => {
        return value.includes("CART REQUEST")
    })

    var channels = cartRequests.map((request) => {
        var JSONCall = JSON.parse(request)
        var body = JSONCall.body.split('::')[1]
        var jsonCartRequest = JSON.parse(body);
        return jsonCartRequest.cartRequest.channel;
    })

    var results = [
        {
            description: "Total Calls Received",
            count: Math.round(totalCalls.length) + " calls"
        },
        {
            description: "Calls to IVP",
            count: Math.round(totalIVPCalls.length) + " calls"
        },
        {
            description: "Calls to VPP",
            count: Math.round(totalVPPCalls.length) + " calls"
        },
        {
            description: "Calls to GPAS",
            count: Math.round(totalGPASCalls.length) + " calls"
        },
        {
            description: "Total Calls Out",
            count: Math.round((totalIVPCalls.length + totalVPPCalls.length + totalGPASCalls.length)) + " calls"
        },
        {
            description: "Shortest Call Time",
            count: timesTaken.length > 0 ? Math.min.apply(Math, timesTaken) + " ms" : "No Calls"
        },
        {
            description: "Longest Call Time",
            count: timesTaken.length > 0 ? Math.round(Math.max.apply(Math, timesTaken)) + " ms" : "No Calls"
        },
        {
            description: "Average Call Time",
            count: timesTaken.length > 0 ? Math.round(total / timesTaken.length) + " ms" : "No Calls"
        },
        {
            description: "V2 Errors",
            count: V2Errors.length + " errors"
        },
        {
            description: "IVP Errors",
            count: IVPErrors.length + " errors"
        },
        {
            description: "VPP Errors",
            count: VPPErrors.length + " errors"
        },
        {
            description: "GPAS Errors",
            count: GPASErrors.length + " errors"
        },
        {
            description: "Manual Bids",
            count: Math.round(manualBids.length) + " bids"
        },
        {
            description: "Calls without a channel",
            count: channels.filter((channel) => { return channel === undefined }).length
        }
    ];

    var uniqueChannels = [];
    channels.forEach(channel => {
        if (uniqueChannels.includes(channel) === false && channel != undefined) {
            uniqueChannels.push(channel)
        }
    });

    uniqueChannels.forEach((channel) => {
        results.push({
            description: `Calls from channel ${channel}`,
            count: channels.filter((item) => { return item === channel }).length
        })
    });

    return (results)
}

module.exports = processMarkdownSplunkResponse;

