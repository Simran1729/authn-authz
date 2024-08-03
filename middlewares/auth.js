const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config();


exports.auth = (req, res, next) => {

    try{
            //here we will check the user's authenticity by verifying the jwt token
            const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer", "");

            // console.log("body : " , req.body.token);
            // console.log("cookies: ", req.cookies.token )
            // // console.log("header: ", req.header("Authorization").replace("Bearer", "") )

            // through cookies and header - you can get your token
            if(!token || token === undefined){
                return res.status(401).json({
                    success : false,
                    message : "token is missing"
                })
            }

            // verify the token
            try{
                const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
                //token matched

                //adding a new user key to req object to use  in further middlewares like role authorization
                req.user = decode;

                next();

            }catch(err){
                return res.status(401).json({
                    success : false,
                    message : "Invalid token"
                })
            }
    } catch(err){
        return res.status(401).json({
            success : false,
            message : "authentication failed",
            problem : err.message
        })
    }
}


//authorization
exports.isStudent = (req, res, next) => {
    try{

        if(req.user.role !== "student"){
            return res.status(401).json({
                success : false,
                message : "This is a protected route for students"
            })
        }


        next();

    } catch(err){
        return res.status(500).json({
            success : false,
            message : "Error occured while student role authorization"
        })
    }
}

exports.isAdmin = (req, res, next) => {
    try{

        if(req.user.role !== "admin"){
            return res.status(401).json({
                success : false,
                message : "This is a protected route for admins"
            })
        }


        next();

    } catch(err){
        return res.status(500).json({
            success : false,
            message : "Error occured while admin role authorization"
        })
    }
}