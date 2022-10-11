let mongoose = require('mongoose')
const { Schema } = mongoose;

let userSchema = mongoose.Schema({    
    username: {type:String},    
    exercises: [{
        type: mongoose.Types.ObjectId, 
        ref: 'Exercise'
    }]
})

//exercises 
let exerciseSchema = mongoose.Schema({
    user: { 
        type: mongoose.Types.ObjectId, 
        ref: 'User' 
      }, 
    description: {type:String},
    duration:Number,
    date: Date
})

let user = mongoose.model('User',userSchema)
let exercise = mongoose.model('Exercise',exerciseSchema)

module.exports = {User:user,Exercise:exercise};


