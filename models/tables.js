const mongoose = require('mongoose');

const tablesSchema =new mongoose.Schema({
    lecturesTable:[[{type:String}]],
    fainalTable:[[{type:String}]],
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('Tables',tablesSchema)