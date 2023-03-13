const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// user model


const userSchema = new Schema({
    "user_name":{
        "type":String,
        "unique":true
    },
    "user_email":String,
    "user_firstName": String,
    "user_lastName": String,
    "password":String,
    "isAdmin":{
        "type":Boolean,
        "default": false
    }

})

module.exports = mongoose.model("users", userSchema);