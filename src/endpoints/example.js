var db = require('../config/dbconnection')

exports.test = function(req, res) {
    db.open()
    res.send('test endcdcpoint is working!')
    db.close()
}
