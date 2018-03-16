const express = require('express')
var bodyParser = require('body-parser')
var path = require('path')
const app = express()
const port = 8080

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/api/getInfo', (request, response) => {
  //REQUEST (body)
  response.send("add");
})

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