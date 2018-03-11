var mongoose = require('mongoose')
var Schema = mongoose.Schema

var diagramSchema = new Schema({
  id: String,
  emailOwner: { type: String, required: true},
  title: { type: String, required: true},
  desc: { type: String, required: true},
  json: { type: String, required: true},
})

module.exports = mongoose.model('Diagram', diagramSchema)
