const express = require('express')
const app = express();
const userRoutes = require('./routes/userRoutes');
const {dbConnection} = require('./config/database');
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(cookieParser())

const port = process.env.PORT;

require('dotenv').config()

app.use('/api',userRoutes)

dbConnection();

app.listen(port , (req, res) => {
    console.log(`server started on port ${port}`)
})

app.get('/', (req, res) => {
    res.send(`<h1>Server is running</h1>`)
})