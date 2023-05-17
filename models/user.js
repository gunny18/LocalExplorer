const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})
//we dont create username and password fields here
//we use the passport package to do that for us

userSchema.plugin(passportLocalMongoose)
//This creates a field for password and username and also give us additional methods to work with
//We dont see explicitly the password and username fields but in the background it is created for us...for the userSchema

module.exports = mongoose.model('User',userSchema)