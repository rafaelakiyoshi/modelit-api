var mongoose = require('mongoose')
var Schema = mongoose.Schema

var userSchema = new Schema({
  id: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nickname: String,
})

module.exports = mongoose.model('User', userSchema)
