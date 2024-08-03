const mongoose = require('mongoose')
require('dotenv').config();

const db_url = process.env.DATABASE_URL;


exports.dbConnection = async() => {
    try{
        await mongoose.connect(db_url);
        console.log("db connected");
        
    }catch(err){
        console.log("error connecting to db");
        console.log(err.message);
        process.exit(1);
    }
}


