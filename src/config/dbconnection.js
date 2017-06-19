module.exports = function(){
  var mongoose = require('mongoose')
  mongoose.connect('mongodb://'
  + (process.env.MONGO_HOST || 'localhost') + ':'
  + '27017' + '/'
  + 'api-db')

  var db = mongoose.connection
  return db;
}
