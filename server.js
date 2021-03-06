const express = require('express')
var bodyParser = require('body-parser')
var path = require('path')
const app = express();

app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false })


var discountMaintenanceApi = require('./server/controllers/DiscountMaintenanceApi');
app.use('/api/discount-maintenance', discountMaintenanceApi);

var markDownServiceApi = require('./server/controllers/MarkDownServiceApi');
app.use('/api/markdown-service', markDownServiceApi);

var circuitBreakerServiceApi = require('./server/controllers/CircuitBreakerApi');
app.use('/api/circuit-breaker', circuitBreakerServiceApi);

var promotionDomainServiceApi = require('./server/controllers/PromotionDomainServiceApi');
app.use('/api/promotion-domain-service', promotionDomainServiceApi);

var sonarCodeCoverageApi = require('./server/controllers/SonarCodeCoverageApi');
app.use('/api/sonar-code-coverage', sonarCodeCoverageApi);

var proBidRoomApi = require('./server/controllers/ProBidRoomApi');
app.use('/api/pro-bid-room', proBidRoomApi);

app.use(express.static(__dirname + '/client/build/'));

app.get("/*", function (request, response) {
  response.sendFile(path.resolve(__dirname, '/client/build'));
});


app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;