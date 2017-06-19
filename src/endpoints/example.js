var db = require('../config/dbconnection')()

exports.test = function(req, res) {
    db.collection('leis').find().count(function(err,items) {
        console.log(items)
    })
    res.send('test endcpoint is working!')
}
