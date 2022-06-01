const mongoose = require('mongoose');

let uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    nickname: {
        type: String,
        maxlength:64,
        minlength:1,
        unique:true,
        exist:true,

    },
    email:{ type: String,
        unique:true,
        exist:true,
        minlength:1
    },

    password:{
        type: String,
        exist:true,
        minlength:8
    },
    image:{
        type: String,
        exist:true,
        default : process.env.RESPONSE_CLOUDINARY_URL+"anonymous_user.png"
    },
    token: {
        type: String,
    },

});

userSchema.plugin(uniqueValidator);
const User = mongoose.model('User', userSchema);
module.exports = User;
