let mongoose = require('mongoose')

let userSchema = mongoose.Schema({
    username: {type:String}
})

let user = mongoose.model('User',userSchema)

module.exports = user;


