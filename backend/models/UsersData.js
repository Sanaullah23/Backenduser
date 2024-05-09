const mongoose= require("mongoose")

const registerUser = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },

    userType:{
        type:String,
        enum:["admin", "user"],
        default:"user"
    },

    isVerify:{
        type:Boolean,
        default:false
    },
    otp:{
        type:Number,
        required:true 
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    completeProfile:{
        type:Boolean,
        default:false
    },
    profileId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userProfile"
    }


})


module.exports=mongoose.model("registerUser", registerUser )