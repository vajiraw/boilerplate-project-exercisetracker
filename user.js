let mongoose = require('mongoose')
const { Schema } = mongoose;

let userSchema = mongoose.Schema({    
    username: {type:String},    
    // exercises: [{
    //     type: mongoose.Schema.Types.ObjectId, 
    //     ref: 'Exercise'
    // }]
})

let user = mongoose.model('User',userSchema)

//exercises 
let exerciseSchema = mongoose.Schema({
    user: { 
        type: String, 
        ref: 'User' 
      }, 
    description: {type:String},
    duration:Number,
    date: Date
})

let exercise = mongoose.model('Exercise',exerciseSchema)

module.exports = {User:user,Exercise:exercise};


