const USER = require('../models/user')
const bycrypt = require('bcrypt')


exports.signUp = async(req, res) => {
    try{
        const {email, password, name, role} = req.body;
        if(!email || !password || !name || !role){
            return res.status(401).json({
                success : false,
                message : "fill complete details"
            })
        }
        const userExists = await USER.findOne({email,name, role})
        if(userExists){
            return res.status(400).json({
                message : "user already exists, try logging in"
            })
        }else{
            let hashedPassword;
            try{
                hashedPassword = await bycrypt.hash(password, 10);
            } catch(err){
                return res.status(500).json({
                    success : false,
                    message : "error hashing password"
                })
            }

            const user = await USER.create({
                email, password : hashedPassword, name, role})
            
            return res.status(200).json({
                success : true,
                message : "user created successfully",
                user : user
            })
        }

    }catch(err){
        res.status(500).json({
            error : "error signing up",
            message : err.message
        })
    } 
}