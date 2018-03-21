const express = require('express')
var bodyParser = require('body-parser')
var path = require('path')
const app = express()
const port = 8090

var urlencodedParser = bodyParser.urlencoded({ extended: false })

var discountMaintenanceApi = require('./server/controllers/DiscountMaintenanceApi')
app.use('/discount-maintenance',discountMaintenanceApi)

app.use(express.static(__dirname + '/client/build/'));

app.get("/*", function (request, response) {
  response.sendFile(path.resolve(__dirname, '/client/build/index.html'));
});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})