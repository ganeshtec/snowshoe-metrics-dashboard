var numberWithCommas = require('../utils/FormatNumbers')

processSonarCodeCoverageResponse = (error, results, app) => {
    if (error) {
        console.log("ERROR Fetching Sonar Code Coverage Data", error)
    } else {
        var obj = JSON.parse(results);
        if(obj.errors) {
            console.log("No results found for application: ", app.description, obj.errors)
            app.count = '-';
        } else if (obj.component) {
            var coverageValue = obj.component.measures && obj.component.measures.length > 0 ? obj.component.measures[0].value + ' %' : '-'
            app.count = coverageValue;
        }
    }
}

module.exports = processSonarCodeCoverageResponse;