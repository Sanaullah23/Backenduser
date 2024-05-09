const express = require('express');
const router=express.Router();
const {registerUser, verifyOtp, completeProfile, Login} =require("../controllers/UserController")
const multer=require("multer")
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, "./upload/")
    },
    filename:function(req,file,cb){
        const uniqueString=Date.now() + "-" + Math.round(Math.random()*1E9)
        const ext = file.originalname.split(".").pop()
        cb(null,"media-" + uniqueString + "." +ext)
    }

})

const upload= multer({storage:storage})

router.post("/userRegister", registerUser)
router.post("/verifyOtp", verifyOtp)
router.post("/complete-profile", upload.single("image"),completeProfile)
router.post("/userLogin",Login)




module.exports=router