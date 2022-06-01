const mongoose = require('mongoose');

let uniqueValidator = require('mongoose-unique-validator');
const {ObjectId} = require("mongodb");

const epicoinSchema = mongoose.Schema({
    user: {
        type : ObjectId, ref: "User",
        exist:true,
    },
    epicount: {
        type : Number,
        default:0,
    },
    room:{
        type : ObjectId, ref: "Room",
        exist:true,
    },

});

epicoinSchema.plugin(uniqueValidator);
const Epicoin = mongoose.model('Epicoin', epicoinSchema);
module.exports = Epicoin;
