const mongoose = require('mongoose')

const dbConnection = process.env.MONGODBURL

mongoose.connect(dbConnection).then(res=>{
    console.log("mongoDB atlas connected successfully with server");
    
}).catch(err=>{
    console.log("connection failed");
    console.log(err);
    
    
})