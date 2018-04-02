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