var numberWithCommas = require('../utils/FormatNumbers')

processSonarCodeCoverageResponse = (error, results, app) => {
    if (error) {
        console.log("ERROR Fetching Sonar Code Coverage Data", error)
    }
    var obj = JSON.parse(results);
    var coverageValue = obj.component.measures.length > 0  ? obj.component.measures[0].value + ' %' : '-'
    app.count = coverageValue;
}

module.exports = processSonarCodeCoverageResponse;