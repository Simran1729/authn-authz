const express = require('express');
const router = express.Router();
const USER = require("../models/user")

const {dummyRoute} = require('../controllers/dummyRoute')
const {signUp} = require('../controllers/signup');
const {login} = require('../controllers/login');
const {auth, isStudent, isAdmin} = require('../middlewares/auth');

router.get('/dummy', dummyRoute);
router.post('/signUp', signUp);
router.get('/login', login);


router.get("/test", auth, (req,res) => {
    res.json({
        success: true,
        message : "Test successful"
    })
})

router.get('/student', auth, isStudent, (req, res) => {
    res.json({
        success : true,
        message : "Welcome to protected route for students"
    })
})

router.get('/admin', auth, isAdmin, (req, res) => {
    res.json({
        success : true,
        message : "Welcome to protected route for admins"
    })
})

router.get('/getEmail', auth, async(req , res) => {
    try{
        let id = req.user.id;
        const user = await USER.findOne({_id : id});

        res.status(200).json({
            success : true,
            user : user,
            message : "welcome to email route"
        })

    } catch(err){
        res.status(404).json({
            success: false,
            message : err.message
        })
    }
})

module.exports = router;