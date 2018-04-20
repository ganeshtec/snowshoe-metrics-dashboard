var numberWithCommas = require('../utils/FormatNumbers')
var percentile = require('percentile');

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
    var callsWithDiscount = rawValues.filter((value) => {
        return value.includes("CART RESPONSE for Markdown Service") && value.includes("promoType");
    });

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
        var body = JSONCall.body.split('::')[1];
        if (body.indexOf('<') == 1) {
            return null;
        } else {
            try {
                var jsonCartRequest = JSON.parse(body);
                return jsonCartRequest.cartRequest.channel;
            } catch (e) {
                console.log('body======', body, e)
            }
        }
    })

    var results = [
        {
            description: "Total Calls Received",
            count: numberWithCommas(Math.round(totalCalls.length)) + " calls"
        },
        {
            description: "Calls to IVP",
            count: numberWithCommas(Math.round(totalIVPCalls.length)) + " calls"
        },
        {
            description: "Calls to VPP",
            count: numberWithCommas(Math.round(totalVPPCalls.length)) + " calls"
        },
        {
            description: "Calls to GPAS",
            count: numberWithCommas(Math.round(totalGPASCalls.length)) + " calls"
        },
        {
            description: "Total Calls Out",
            count: numberWithCommas(Math.round((totalIVPCalls.length + totalVPPCalls.length + totalGPASCalls.length))) + " calls"
        },
        {
            description: "Shortest Call Time",
            count: timesTaken.length > 0 ? numberWithCommas(Math.min.apply(Math, timesTaken)) + " ms" : "No Calls"
        },
        {
            description: "98 Percentile Call Time",
            count: timesTaken.length > 0 ? numberWithCommas(Math.round(percentile(98, timesTaken))) + "ms" : " No Calls"
        },
        {
            description: "Average Call Time",
            count: timesTaken.length > 0 ? numberWithCommas(Math.round(total / timesTaken.length)) + " ms" : "No Calls"
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

    /**Promo Metrics Section */

    var discountsMap = new Map();
    var promoIdsWithCount = new Map();

    buildUniquePromoIds = (discountsMap, value, ts) => {
        var uniquePromoIds = discountsMap.get(ts);
        if (!uniquePromoIds) {
            uniquePromoIds = new Set();
        }
        var promosArray = value.split("promoId")
        promosArray.shift()
        promosArray.map((promo) => {
            promoId = promo.slice(5, promo.indexOf(',') - 2)
            if (!isNaN(parseFloat(promoId)) && isFinite(promoId)) {
                uniquePromoIds.add(promoId);
            }
        });
        discountsMap.set(ts, uniquePromoIds);
    }

    callsWithDiscount.forEach((value, index) => {
        var ts = JSON.parse(value).ts
        buildUniquePromoIds(discountsMap, value, ts);
    });

    var callsWithPromoType = rawValues.filter((value) => {
        if (value.includes("promoId") && value.indexOf("CART RESPONSE for Markdown Service") === -1) {
            var responseTs = JSON.parse(value).ts;
            if(discountsMap.get(responseTs)) {
                buildUniquePromoIds(discountsMap, value, responseTs);
                return true;
            }
        }
        return false;
    });

    discountsMap.forEach((promoIds, key, mapObj) => {
        promoIds.forEach((promoId) => {
            var count = promoIdsWithCount.get(promoId) || 0;
            promoIdsWithCount.set(promoId, ++count);
        })
    })

    results.push(
        {
            description: "--------PROMO METRICS--------"
        }, {
            description: "Numbers of calls with a discount returned: ",
            count: Math.round(callsWithDiscount.length) + " calls"
        }, {
            description: "Percentage of calls with a discount returned: ",
            count: Math.round((totalCalls.length ? (callsWithDiscount.length / totalCalls.length) : 0) * 10000) / 100 + " %"
        }
    );
    promoIdsWithCount.forEach((count, promoId, mapObj) => {
        results.push(
            {
                description: "Promo " + promoId,
                count: count
            }
        );
    })
    return (results)
}

module.exports = processMarkdownSplunkResponse;

