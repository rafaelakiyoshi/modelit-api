var app = require('./config/custom-express')()
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.listen(3000, function () {
  console.log('Servidor rodando na porta 3000!')
})

app.get('/teste', function (req, res){
    console.log('Endpoint Funcionando!')
    res.send('Endpoint Funcionando!')
})
