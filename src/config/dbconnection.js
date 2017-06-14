var mongo = require('mongodb')
var Server = mongo.Server
Db = mongo.Db
BSON = mongo.BSONPure;

var server = new Server((process.env.MONGO_HOST || 'localhost'), 27017, {auto_reconnect: true})
db = new Db('docsument-name', server)

exports.open = function(){
    db.open(function(err, db) {
        if(!err) {
            console.log("Connected to 'api-db' database");
        }
    })
}

exports.close = function(){
    db.close(function(err, db) {
        if(!err) {
            console.log("Closed Connect to 'api-db' database");
        }
    })
}
