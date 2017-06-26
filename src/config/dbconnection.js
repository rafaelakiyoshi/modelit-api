module.exports = function(){
  var mongoose = require('mongoose')
  // mongoose.connect('mongodb://'
  // + (process.env.MONGO_HOST || 'localhost') + ':'
  // + '27018' + '/'
  // + 'api-db')

var MONGO_DB;
var FIG_DB = process.env.DB_1_PORT;
if ( FIG_DB ) {
  MONGO_DB = FIG_DB.replace( "tcp", "mongodb" ) + "/api_db";
} else {
  MONGO_DB = process.env.MONGO_URL;
}
mongoose.connect(MONGO_DB);

  var db = mongoose.connection
  return db;
}
