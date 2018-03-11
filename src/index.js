var app = require('./config/custom-express')()
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose')
mongoose.connect('mongodb://root:root@ds263988.mlab.com:63988/modelit')

app.use(cors())

app.use(bodyParser.json())
app.listen(3000, function () {
  console.log('Server running on port 3000!')
})

var api = require('./endpoints/user');
app.get('/user', api.list);
app.get('/user/:email', api.get);
app.delete('/user/:id', api.delete);
app.put('/user/:id', api.update);
app.post('/user', api.add);

app.post('/diagram', api.addDiagram);
app.get('/listdiagrams/:id', api.listDiagram);