const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors');


mongoose.connect('mongodb+srv://api:api@cluster0.svqldx1.mongodb.net/').then(()=>console.log('conected to mongoDB')).catch(()=>{console.log('Error Not connected to any thing')})

const userCreate = require('./routes/userRoutes')

const app = express();
app.use(cors())
const port = 3000;
app.use(express.json()); 

app.use(userCreate)

app.listen(port,()=>console.log(`listen to port ${port}`))