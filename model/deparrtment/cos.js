const mongoose = require('mongoose')
const cosSchema = mongoose.Schema({
    email: {type: String, required: true},
    date: {type: String, required: true},
    time: {type: String, required: true},
    output: {type: String, required: true},
    details: {type: String, required: true},
    verify: {type: String, required: true},
    department: {type: String, required: true},
},
{collection: 'COS'})

const model = mongoose.model('cosSchema', cosSchema)
module.exports = model
