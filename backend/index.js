const express = require('express')
const cors= require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const connectDB = require('./config/db')
const router = require('./routes')


const app = express()
app.use(cors({
    origin : 'http://localhost:3000',
    credentials : true
}))
app.use('/api/webhook', express.raw({ type: 'application/json' }))
app.use(express.json())
app.use(cookieParser())

app.use("/api",router)

const PORT = process.env.PORT || 8080

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("Server is running")
    })

}).catch((err)=>{
    console.error('Server startup aborted because DB connection failed')
    process.exit(1)

})


