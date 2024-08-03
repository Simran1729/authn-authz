const USER = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
require('dotenv').config()

exports.login = async (req, res) => {
    try{
            const {email, password} = req.body;
            
            if(!email || !password){
                return res.status(400).json({
                    success : false,
                    message : "please fill all the details"
                })
            }

            let user = await USER.findOne({email});

            if(!user){
                return res.status(401).json({
                    success : false,
                    message : "user not found, try signing up"
                })
            }

            //user exists -- verify password and generate a jwt token
                // --verify password
            if(await bcrypt.compare(password , user.password)){
                //password match
                const payload = {
                    name : user.name,
                    email : user.email,
                    id : user._id,
                    role : user.role
                }

                let token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
                    expiresIn : "3h",
                });

                user = user.toObject();
                user.token = token;
                user.password = undefined;

                const options = {
                    expires : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                    httpOnly : true,
                }

                res.cookie("token", token, options).status(200).json({
                    message : "logged in successfully",
                    success :  true,
                    user,
                    token
                });

            }else{
                //password doesnt match
                res.status(403).json({
                    success : false,
                    message : "password doesn't match"
                })
            }

        
    } catch(err){
        res.status(500).json({
            success : false,
            message : "error logging in",
            problem : err.message
        })
    }

}