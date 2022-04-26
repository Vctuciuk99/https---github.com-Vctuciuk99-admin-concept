const mongoose = require('mongoose')
const citSchema = mongoose.Schema({
    email: {type: String, required: true},
    date: {type: String, required: true},
    time: {type: String, required: true},
    output: {type: String, required: true},
    details: {type: String, required: true},
    verify: {type: String, required: true},
    department: {type: String, required: true},
},
{collection: 'CIT'})

const model = mongoose.model('citSchema', citSchema)
module.exports = model
