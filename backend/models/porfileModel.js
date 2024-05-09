const mongoose= require("mongoose");

const profileSchema=new mongoose.Schema({
    gender:{
        type:String,
        required:true,
        enum:["male", "female","other"]
    },
    contactNo:{
        type:Number,
        required:true
    },
    profileImage:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"registerUser"
    }

});

module.exports= mongoose.model("userProfile", profileSchema)