const mongoose = require("mongoose");
const userShema = mongoose.Schema({
    email: String,
    password: String,
    role:{
        type:String,
        enum:["admin","kunde"],
        default:"kunde",
        required:true
        
    }
})

const user = mongoose.model("user",userShema);
module.exports = user;