var ibmdb = require('ibm_db');

var config;

if (process.env.config) {
    config = JSON.parse(process.env.config);
} else {
    var configJson = require('../../config/config.json');
    config = configJson.config;
}

var statusReportQueryPart1 = "select C.CORD_SRC_PRCSS_CD AS CODE," +
"CASE C.CORD_SRC_PRCSS_CD " +
"WHEN 57 THEN 'Online' " +
"WHEN 87 THEN 'Store' " +
"WHEN 9 THEN 'Internet Sales' " +
"WHEN 14 THEN 'Point Of Sale' " +
"WHEN 17 THEN 'Pro Desk' " +
"WHEN 118 THEN 'Order Up' " +
"WHEN 44 THEN 'Quote Center' " +
"WHEN 51 THEN 'Pro eCommerce' " +
"WHEN 28 THEN 'Volume Pricing Program' " +
"ELSE 'Unknown (' || C.CORD_SRC_PRCSS_CD || ')' " +
"END AS DESCRIPTION," +
"COUNT(*) AS COUNT from PRMO_SKU_CHG_RQST R join PRMO_SKU_CHG_SRC_PRCSS C on C.SKU_CHG_RQST_ID = R.SKU_CHG_RQST_ID ";

var statusReportQueryPart2 = "GROUP BY C.CORD_SRC_PRCSS_CD " +
"UNION " +
"SELECT 9999 AS CODE, 'All' AS DESCRIPTION, count(*) AS COUNT FROM PRMO_SKU_CHG_RQST ";

var whereActive = " WHERE SKCHG_RQST_STAT_CD = '61' ";
var andActive = " AND SKCHG_RQST_STAT_CD = '61' ";
var wherePending = " WHERE SKCHG_RQST_STAT_CD = '57' ";
var startDateClause = "AND EFF_BGN_TS > CURRENT TIMESTAMP ";
var daysClause = "DAYS ";
var endDateClause = "AND EFF_BGN_TS < CURRENT TIMESTAMP ";
var withURClause = "WITH UR ";

//Query for Customer Segments
var customerSegmentTable = " select 'Customer Segment' AS DESCRIPTION, count(*) as count from PRMO_SKU_CHG_RQST R join PRMO_SKU_CHG_CUST_SEG C on R.SKU_CHG_RQST_ID=C.SKU_CHG_RQST_ID ";
var hasCustomerSegment = " C.CUST_SEG_ID > 0 "
var activePromotionsWithCustomerSegmentQuery = customerSegmentTable + whereActive + " AND " + hasCustomerSegment;

// Queries for Qualifiers
var quantityThresholdQuery = " select 'Quantity Threshold' AS DESCRIPTION, COUNT(*) AS count from PRMO_SKU_CHG_RQST WHERE SKU_CHG_RQST_ID IN (select SKU_CHG_RQST_ID from PRMO_SCRQ_ERUL_TIER where MIN_PURCH_LMT_QTY is not null and MIN_PURCH_LMT_QTY > 0) " + andActive
var dollarThresholdQuery = " select 'Dollar Spend Threshold' AS DESCRIPTION, COUNT(*) AS count from PRMO_SKU_CHG_RQST WHERE SKU_CHG_RQST_ID IN (select SKU_CHG_RQST_ID from PRMO_SCRQ_ERUL_TIER where MIN_PURCH_LMT_AMT is not null and MIN_PURCH_LMT_AMT > 0) " + andActive
var basketThresholdQuery =  " select 'Basket Threshold' AS DESCRIPTION, COUNT(*) AS COUNT from PRMO_SKU_CHG_RQST WHERE SKU_CHG_RQST_ID IN (select SKU_CHG_RQST_ID from PRMO_PURCH_COND where BSKT_THRH_AMT is not null and BSKT_THRH_AMT > 0) " + andActive
var qualifiersQuery = activePromotionsWithCustomerSegmentQuery + " UNION " + quantityThresholdQuery + " UNION " + dollarThresholdQuery + " UNION " +basketThresholdQuery;

// Queries for Rewards
var amountOffRewardQuery = " select 'Amount off Reward' AS DESCRIPTION, Count(*) As COUNT from PRMO_SKU_CHG_RQST WHERE SKU_CHG_RQST_ID IN (select SKU_CHG_RQST_ID from PRMO_SCRQ_DISC_TIER where ELIG_METH_IND is not null and ELIG_METH_IND = 'AMT') " + andActive;
var percentOffRewardQuery = " select 'Percent off Reward' AS DESCRIPTION, Count(*) As COUNT from PRMO_SKU_CHG_RQST WHERE SKU_CHG_RQST_ID IN (select SKU_CHG_RQST_ID from PRMO_SCRQ_DISC_TIER where ELIG_METH_IND is not null and ELIG_METH_IND = 'PER') " + andActive;
var rewardsQuery = amountOffRewardQuery + " UNION " + percentOffRewardQuery


// Queries for Attributes
var labelsQuery = " select 'Promotions with labels' AS DESCRIPTION, Count(*) As COUNT from PRMO_SKU_CHG_RQST WHERE PRT_LBL_FLG = 'Y' " + andActive;
var itemPromoQuery = " select 'Item level promotion' AS DESCRIPTION, Count(*) As COUNT from PRMO_SKU_CHG_RQST WHERE SKCHG_RQST_TYP_CD = 10 " + andActive;
var orderPromoQuery = " select 'Order level promotion' AS DESCRIPTION, Count(*) As COUNT from PRMO_SKU_CHG_RQST WHERE SKCHG_RQST_TYP_CD = 20 " + andActive;
var attributesQuery = labelsQuery + " UNION " + itemPromoQuery + " UNION " + orderPromoQuery;


var wherePendingTomorrow = wherePending + startDateClause + "+ 1 " + daysClause + endDateClause + "+ 2 " + daysClause;
var wherePendingfuture = wherePending + startDateClause + "+ 2 " + daysClause;

var allActiveQuery = statusReportQueryPart1 + whereActive + statusReportQueryPart2 + whereActive + withURClause;
var tomorrowPendingQuery = statusReportQueryPart1 + wherePendingTomorrow + statusReportQueryPart2 + wherePendingTomorrow + withURClause;
var futurePendingQuery = statusReportQueryPart1 + wherePendingfuture + statusReportQueryPart2 + wherePendingfuture + withURClause;

var data = [];

getPromotionStatusReport = () => {
    
    return new Promise(function (resolve, reject) {
        ibmdb.open(config.db2ConnectInfo, function(err, conn)
        {
            if(err) {
                reject(err.message);
            } else {
                var activeQuery = conn.query(allActiveQuery);
                var tomorowQuery = conn.query(tomorrowPendingQuery);
                var futureQuery = conn.query(futurePendingQuery);
                
                return Promise.all([activeQuery, tomorowQuery, futureQuery]).then(results => {

                    for (var i=0;i<results[0].length;i++) {
                        addResult(results[0][i],'current');
                    }

                    for (var i=0;i<results[1].length;i++) {
                        addResult(results[1][i],'tomorrow');
                    }

                    for (var i=0;i<results[2].length;i++) {
                        addResult(results[2][i],'future');
                    }

                    resolve(data);
                    conn.close();

                }).catch(function(err) {
                    reject(err);
                });
            }
        })}
    )
}

getQualifiersForActivePromotions = () => {
    
    return new Promise(function (resolve, reject) {
        ibmdb.open(config.db2ConnectInfo, function(err, conn)
        {
            if(err) {
                reject(err.message);
            } else {
                var data = []   
                var qualifiersResults = conn.query(qualifiersQuery);
                       
                return qualifiersResults.then(results => { 
                    var data = mapSqlToReactData(results)
                    resolve(data);
                    conn.close();

                }).catch(function(err) {
                    reject(err);
                });
            }
        })}
    )
}

getRewardsForActivePromotions = () => {
    
    return new Promise(function (resolve, reject) {
        ibmdb.open(config.db2ConnectInfo, function(err, conn)
        {
            if(err) {
                reject(err.message);
            } else {
                var data = []   
                var rewardResults = conn.query(rewardsQuery);
                       
                return rewardResults.then(results => { 
                    var data = mapSqlToReactData(results)   
                    resolve(data);
                    conn.close();

                }).catch(function(err) {
                    reject(err);
                });
            }
        })}
    )
}

getAttributesForActivePromotions = () => {
    
    return new Promise(function (resolve, reject) {
        ibmdb.open(config.db2ConnectInfo, function(err, conn)
        {
            if(err) {
                reject(err.message);
            } else {
                var data = []   
                var attributeResults = conn.query(attributesQuery);
                       
                return attributeResults.then(results => { 
                    var data = mapSqlToReactData(results)
                    resolve(data);
                    conn.close();

                }).catch(function(err) {
                    reject(err);
                });
            }
        })}
    )
}


function mapSqlToReactData(SqlResults) {
    var reactData = []
    SqlResults.forEach(result => {
        obj = {'description' : result.DESCRIPTION, 'count' : result.COUNT};
        reactData.push(obj);  
    })
    return reactData
}

function addResult(row,source) {

    var obj = data.find(o => o.code === row.CODE);

    if(undefined === obj){
        obj = {'code' : row.CODE,  'description' : row.DESCRIPTION, 'count': [0, 0, 0]};
        data.push(obj);
    }

    if(source === "current") {
        obj.count[0] = row.COUNT;
    }

    if(source === "tomorrow") {
        obj.count[1] = row.COUNT;
    }

    if(source === "future") {
        obj.count[2] = row.COUNT;
    }

}

module.exports = {getPromotionStatusReport, getQualifiersForActivePromotions, getRewardsForActivePromotions,getAttributesForActivePromotions}