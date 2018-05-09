var numberWithCommas = require('../utils/FormatNumbers')

processProBidRoomSplunkResponse = (error, results) => {
    var rawValues = [];
    var valuesForTS = [];
    var rawValuesUnique = new Set();
    var requestTimestamps = new Map();
    var responseTimestamps = new Map();
    
    if (error) {
        console.log("ERROR Fetching Splunk Data", error)
    }

    var fields = results.fields;
    var rows = results.rows;
    for (var i = 0; i < rows.length; i++) {
        var values = rows[i];
        for (var j = 0; j < values.length; j++) {
            var field = fields[j];
            var value = values[j];
            if (field === "_raw") {
                valuesForTS.push(value)
                rawValuesUnique.add(value.substring(value.indexOf("GPAScartRe")))
            }
        }
    }
    rawValuesUnique.forEach( (v) => {rawValues.push(v)})

    var cartRequests = valuesForTS.filter((value) => {
        return value.includes("GPAScartRequest");
    });
    var cartResponses = valuesForTS.filter((value) => {
        return value.includes("GPAScartResponse");
    });

    cartRequests.forEach((cart) => {
        var orderIdInd = cart.indexOf("orderId")
        var orderId = cart.substring( orderIdInd + 10, cart.indexOf(",", orderIdInd))
        var timestamp = cart.substring(0, 28)
        requestTimestamps.set(String(orderId), new Date(timestamp).getTime())
    })

    cartResponses.forEach((cart) => {
        var orderIdInd = cart.indexOf("orderId")
        var orderId = cart.substring( orderIdInd + 12, cart.indexOf(",", orderIdInd) - 2)
        var timestamp = cart.substring(0, 28)
        responseTimestamps.set(String(orderId), new Date(timestamp).getTime())
    })

    var cartResposeTime = 0
    var cartShortestResposeTime = Number.MAX_VALUE;
    var cartLongestResposeTime = 0;
    var cartTotalResposeTime = 0

    requestTimestamps.forEach((reqTime, orderId) => {
        cartResposeTime = responseTimestamps.get(orderId) - reqTime
        if(cartResposeTime < cartShortestResposeTime) {
            cartShortestResposeTime = cartResposeTime;
        }
        if(cartResposeTime > cartLongestResposeTime) {
            cartLongestResposeTime = cartResposeTime;
        }
        cartTotalResposeTime += cartResposeTime;
    })
    
    var callsToProBidRoom = rawValues.filter((value) => {
        return value.includes("GPAScartResponse");
    });

    var callsWithDiscount = rawValues.filter((value) => {
        return value.includes("promoId");
    });

    var output = [
         {
             description: "Totals Calls: ",
             count: callsToProBidRoom.length + " calls"
         },
         {
             description: "Shortest Response Time: ",
             count: cartShortestResposeTime + " ms"
         },
         {
             description: "Average Response Time: ",
             count: Math.round(cartTotalResposeTime/requestTimestamps.size) + " ms"
         },
         {
             description: "Longest Response Time: ",
             count: cartLongestResposeTime + " ms"
         },
         {
             description: "Numbers of calls with a discount returned: ",
             count: callsWithDiscount.length
         },
         {
             description: "Percentage of calls with a discount returned: ",
             count: Math.round((callsWithDiscount.length/callsToProBidRoom.length) * 10000)/100 + '%'
         }
    ]
    
    var promoIndex = 0;

    var promoIdsWithCount = new Map();
    callsWithDiscount.forEach((cart) => {
        promoIndex = cart.indexOf("promoId") + 12
        promo = cart.slice(promoIndex, cart.indexOf(",", promoIndex)-2)
        console.log(promo)
        var count = promoIdsWithCount.get(promo) || 0;
        promoIdsWithCount.set(promo, ++count);
    })
    
    promoIdsWithCount.forEach((count, promoId, mapObj) => {
        output.push(
        {
            description: "Promo " + promoId,
            count: count
        });
    })
    return (output)
}

module.exports = processProBidRoomSplunkResponse;