const mongoose = require('mongoose');

const letcureSchema = new mongoose.Schema({
    name:{
        type:String,
        uniqure:true,
        required:true,
    },

    teacher:{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User' 
        },

    students:[ { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
         } ],

     maxMembers: { type: Number, default: 6 },
})

module.exports = mongoose.model('Lecture',letcureSchema)