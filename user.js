let mongoose = require('mongoose')
const { Schema } = mongoose;

let userSchema = mongoose.Schema({
    username: {type:String},
    
})

let user = mongoose.model('User',userSchema)

//exercises 
let exerciseSchema = mongoose.Schema({
    userid:{type:Schema.ObjectId},   
    description: {type:String},
    duration:Number,
    date: Date
})

let exercise = mongoose.model('Exercise',exerciseSchema)

module.exports = {User:user,Exercise:exercise};


