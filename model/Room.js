const mongoose = require('mongoose');

let uniqueValidator = require('mongoose-unique-validator');
const {ObjectId} = require("mongodb");

const roomSchema = mongoose.Schema({
    name: {
        type: String,
        exist:true,
        unique:true,
        minlength:1
    },
    description: {
        type: String,
          },
    bets:{
            type:[{ type : ObjectId, ref: "Bet"}]
        },
    category:{
        type: String,
        minlength:1,
        exist:true,
    },
    participants:{
        type:[{ type : ObjectId, ref: "User"}]
    },
    admin:{
        type : ObjectId, ref: "User",
    },
    invited:{
        type:[{ type : ObjectId, ref: "User"}]
    },
    private:{
        type: Boolean,
    },
    open:{
        type:Boolean,
        default:true,
    },

});

roomSchema.plugin(uniqueValidator);
const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
