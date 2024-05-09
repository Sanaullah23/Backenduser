const RegUser = require("../models/UsersData")
const bcrypt=require("bcrypt")
const jsonWToken=require("jsonwebtoken")
const nodeMailer=require("nodemailer")
const {check_missing_fields}=require("../helper/commonFunction")
const porfileModel = require("../models/porfileModel")



// secret key to encrypt password
const secretKey=""

/// Register User
exports.registerUser = async(req, res)=>{
    try {
        const {email, name, password}= req.body;
        const CheckUser= await RegUser.findOne({email})
        
        if(CheckUser){
            res.status(201).json({
                message:"User is already created !",
                User: CheckUser
            })
        }else{
            const hashPassword= await bcrypt.hash(password,12);
            const OTP = Math.floor(100000+Math.random()*900000)
            req.body.password=hashPassword;
            req.body.otp=OTP
            const Data = await RegUser.create(req.body)
            const token=jsonWToken.sign({user_id:Data._id}, secretKey ,{expiresIn:"1h"})
            const transportor=nodeMailer.createTransport({
                service:"gmail",
                auth:{
                    user:"",
                    pass:""
                },
                tls: {
                    rejectUnauthorized: false
                }
            })

            const info={
                from:"",
                to:email,
                subject:"welcome to Bloggers",
                html:`<h1>Welcome ${name}</h1>
                <p>your OTP is ${OTP}</p>
               `
            }

            transportor.sendMail(info, (err, result)=>{
                if(err){
                    console.log("Error in sending Mail", err);
                    return res.status(500).json({ error: "Error sending email" });
                }
                else{
                    res.status(201).json({
                        message:"user created successfully, OTP Sent to your mail",
                        succes:true,
                        Data,
                        token  });
                }
            })


            
        }
    } catch (error) {
        
        res.status(400).json({
            message:"internal server error",
            succes:false,
            error  });
        
    }
}


/// Verify OTP
exports.verifyOtp = async (req, res) => {

    const { body, headers } = req
    const { authorization } = headers
    const { otp } = body

    console.log(authorization)


    if (!authorization) {
        return res.status(401).json({
             message: 'No token provided'
             });
    }

    else {

        const missing_fields = check_missing_fields(
            ["otp"],
            body
        );

        if (missing_fields.length) {
            res.status(422).json({
                status: 422,
                message: "All fields are required!",
                missing_fields,
            });
            return;
        }
        jsonWToken.verify(authorization, secretKey, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Failed to authenticate token' });
            }

            // You can access the user's ID in decoded.user_id
            req.userid = decoded.user_id;
           const userFind = await RegUser.findById(req.userid)
            console.log(userFind)
            if (userFind.otp == otp) {
                await userFind.updateOne({
                    isVerify: true,
                })
                const newToken = jsonWToken.sign({ userid: req.userid }, secretKey, {
                    expiresIn: '1h'}) // Token validity duration (change as needed);

                    return res.status(200).json({
                         message: 'Verify OTP successfully', 
                         token: newToken });
            }
            else {
                return res.status(401).json({ message: 'Invalid Otp' });
            }


        });

    }


}
///Complete Profile
exports.completeProfile= async (req, res)=>{
    const { body, headers } = req
    const { authorization } = headers

    try {
        if (!authorization) {
            return res.status(401).json({
                 message: 'No token provided'
                 });
        }
        jsonWToken.verify(authorization,secretKey, async(err, decode)=>{
            if(err){
                return res.status(401).json({
                    message:"Unauthorized"
                })
            }
            else{
                req.userid = decode.userid;
                const user = await RegUser.findById(req.userid)
                if(user.completeProfile==false){
                        const profileObj={
                            gender:req.body.gender,
                            contactNo:req.body.contactNo,
                            profileImage:req.file.path,
                            userId:req.userid
                        }

                        const userProfile= porfileModel(profileObj)
                        await userProfile.save()
                       

                       await RegUser.findByIdAndUpdate(req.userid, {
                        completeProfile:true,
                        profileId:userProfile._id
                       })

                       return res.status(201).json({
                        message:"User Data",
                        data:profileObj,
                        profileid:userProfile._id
                    
                    })

                }else{
                    return res.status(200).json({
                        message:"Already Completed Profile",
                        
                    
                    })
                }
               
            }

        })

       
    } catch (error) {
        return res.status(500).json({message:"internal server issue", error});
        
    }
}

/// Login user and check password and email
exports.Login = async(req,res)=>{
    try {
        const {body} = req;
        const { email , password} = body;
        console.log(email, password)
        if(email == undefined  || password == undefined){
            return res.status(409).json({
                message:"All fields are required (email, password)",
                succes:false
            });

        }else{
            findUser= await RegUser.findOne({email}).populate("profileId")
            if(findUser.isVerify==false){
                return res.status(400).json({
                    message:"your account is not verified Verify It ",
                    succes:false
                });
            }else{
                if(findUser){
                    const checkpassword= await bcrypt.compare(password, findUser.password)
                    console.log(checkpassword)
                    if(checkpassword){
                        return res.status(200).json({
                            message:"user loged in",
                            userData:findUser
                        });
                    }
                }
            }
            
          
        }

    } catch (e) {
        return res.status(400).json({
            message:"User Not Found",
            error:e
        })
    }
}