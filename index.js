require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./routes/router')
require('./db/connection')

const blogServer = express()

blogServer.use(cors())
blogServer.use(express.json())
blogServer.use(router)

blogServer.use('/uploads', express.static('uploads')); 

const PORT = 3000 || process.env.PORT

blogServer.listen(PORT, ()=>{   
    console.log(`server started at port ${PORT}`);
    
})  

