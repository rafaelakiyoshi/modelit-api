var app = require('./config/custom-express')()
var bodyParser = require('body-parser')
var example = require('./endpoints/example')

app.use(bodyParser.json())
app.listen(3000, function () {
  console.log('Server running on port 3000!')
})

app.get('/example', example.test);
