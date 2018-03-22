const express = require('express')
var bodyParser = require('body-parser')
var path = require('path')
const app = express()

var urlencodedParser = bodyParser.urlencoded({ extended: false })

var discountMaintenanceApi = require('./server/controllers/DiscountMaintenanceApi')
app.use('/discount-maintenance', discountMaintenanceApi)

var markDownServiceApi = require('./server/controllers/MarkDownServiceApi')
app.use('/api/markdown-service', markDownServiceApi)

app.use(express.static(__dirname + '/client/build/'));

app.get("/*", function (request, response) {
  response.sendFile(path.resolve(__dirname, '/client/build/index.html'));
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