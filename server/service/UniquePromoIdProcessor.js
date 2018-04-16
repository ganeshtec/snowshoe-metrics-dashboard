var numberWithCommas = require('../utils/FormatNumbers')

uniquePromoIdProcessor = (err, results) => {
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
    var promoIdsWithCorrelationIds = [];

    rawValues.forEach((value, index) => {
        var correlationIdPosition = value.lastIndexOf("correlationId=");

        var correlationId = value.slice(correlationIdPosition + 15, correlationIdPosition + 51)
        
        
        var promosArray = value.split("promoId")
        promosArray.shift()
        var promoIds = promosArray.map((promo) => {
            return promo.slice(5, 9)
        })
        promoIds = promoIds.filter((promoId) => {
            return !isNaN(parseFloat(promoId)) && isFinite(promoId);
        })
    

        promoIdsWithCorrelationIds.push({correlationId: correlationId, promoIds: promoIds})
      
    })

    promoIdsWithCorrelationIds = promoIdsWithCorrelationIds.sort((a,b) => {
        return a.correlationId - b.correlationId;
    })

    promoIdsWithCorrelationIds.sort(function(a,b) {
        var x = a.correlationId;
        var y = b.correlationId;
        return x < y ? -1 : x > y ? 1 : 0;
    });

    for(var i = 0; i < promoIdsWithCorrelationIds.length-1; i++){

        if(promoIdsWithCorrelationIds[i].correlationId === promoIdsWithCorrelationIds[i+1].correlationId){
            promoIdsWithCorrelationIds[i+1].promoIds = promoIdsWithCorrelationIds[i].promoIds.concat(promoIdsWithCorrelationIds[i+1].promoIds)
            promoIdsWithCorrelationIds[i].promoIds = []
        }
    }

    
    var uniquePromos = []
    for(var i = 0; i < promoIdsWithCorrelationIds.length-1; i++){
       
        uniquePromos = []
        var promos = promoIdsWithCorrelationIds[i].promoIds;
        for(var j = 0; j < promos.length; j++){
            if(!uniquePromos.includes(promos[j])){
                uniquePromos.push(promos[j])
            }
        }
        promoIdsWithCorrelationIds[i].promoIds = uniquePromos
    }

    var promoIdsWithCount = [];

    for(var i = 0; i < promoIdsWithCorrelationIds.length; i++){
        var promoWithCorrelationId = promoIdsWithCorrelationIds[i]
        for(var j = 0; j < promoWithCorrelationId.promoIds.length; j++){
            var index = promoIdsWithCount.findIndex((obj) => {
              return obj.description === (promoWithCorrelationId.promoIds[j]);
            })

            if(index !== -1){
                promoIdsWithCount[index].count = promoIdsWithCount[index].count + 1
            } else {
                
                promoIdsWithCount.push({description: promoWithCorrelationId.promoIds[j], count: 1})
            }
        }
    }

    promoIdsWithCount = promoIdsWithCount.sort((a, b) => {
            return a.description - b.description
            })
        .map((obj) => {
            obj.description = "Promo " + obj.description
            return obj
         })

    return (promoIdsWithCount)

}

module.exports = uniquePromoIdProcessor;

