const testUser =require('../models/testUser');
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
secretkey='sanaullahbharchoon99';
exports.createTestUser = async(req, res)=>{
    try {
        const {name, email, password} = req.body;
        const findTestUser= await testUser.findOne({email});
        if (findTestUser) {
            res.status(400).json({
                message:"this email used",
                success:false
            })
        }else{
            const encryptedPassword = await bcrypt.hash(password, 12);
            const user = await testUser.create({
                name:name,
                email:email,
                password:encryptedPassword
            })

            const TOKEN =JWT.sign({userid:user._id}, secretkey, {expiresIn:'3h'});

            res.status(201).json({
                message:"user created seccessfully ",
                success:true,
                user:user,
                token:TOKEN
            })

        }
    } catch (error) {
        res.status(500).json({
            message:"internal server error ",
            success:false,
            error:error.message
        })
    }
}

exports.getTestUser = async(req, res)=>{
       const { headers}= req;
        const {authorization} =headers;
        
    try {
        
        if (!authorization) {
            return res.status(401).json({
                 message: 'No token provided'
                 });
        }

        JWT.verify(authorization, secretkey,async(err, decode)=>{
            if (err) {
                return res.status(401).json({
                    message:"Unauthorized"
                })
            }else{
                if (req.body.email !==undefined && req.body.password) {
                    req.userid=decode.userid;
                    const user = await testUser.findById(req.userid)
                    if (user){
                        const checkPassword = await bcrypt.compare(req.body.password, user.password)
                            if (checkPassword) {
                                const  RefreshTOKEN = JWT.sign({userid:req.userid}, secretkey)
                                res.status(200).json({
                                    message:"login successfully",
                                    success:true,
                                    user:user,
                                    Retoken:RefreshTOKEN
                                })
                            }
                           
                    }else{
                        return res.status(400).json({
                            message:"User Not Found",
                            
                        })
                    }
                }
               
            }
        })
        
    } catch (error) {
        
    }
}