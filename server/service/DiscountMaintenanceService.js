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
var wherePending = "WHERE SKCHG_RQST_STAT_CD = '57' ";
var startDateClause = "AND EFF_BGN_TS > CURRENT TIMESTAMP ";
var daysClause = "DAYS ";
var endDateClause = "AND EFF_BGN_TS < CURRENT TIMESTAMP ";
var withURClause = "WITH UR ";

var wherePendingTomorrow = wherePending + startDateClause + "+ 1 " + daysClause + endDateClause + "+ 2 " + daysClause;
var wherePendingfuture = wherePending + startDateClause + "+ 2 " + daysClause;

var allActiveQuery = statusReportQueryPart1 + whereActive + statusReportQueryPart2 + whereActive + withURClause;
var tomorrowPendingQuery = statusReportQueryPart1 + wherePendingTomorrow + statusReportQueryPart2 + wherePendingTomorrow + withURClause;
var futurePendingQuery = statusReportQueryPart1 + wherePendingfuture + statusReportQueryPart2 + wherePendingfuture + withURClause;

var data = [];

function addResult(row,source) {

    var obj = data.find(o => o.code === row.CODE);

    if(undefined === obj){
        obj = {'code' : row.CODE,  'description' : row.DESCRIPTION, 'count' : 0, 'tomorrow' : 0, 'future' : 0};
        data.push(obj);
    }

    if(source === "current") {
        obj.count = row.COUNT;
    }

    if(source === "tomorrow") {
        obj.tomorrow = row.COUNT;
    }

    if(source === "future") {
        obj.future = row.COUNT;
    }

}

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

module.exports = getPromotionStatusReport