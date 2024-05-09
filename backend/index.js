const express =require('express');
const mongoose =require('mongoose');
// const userRoutes=require("./routes/userRoutes")
const testUserRoutes = require('./routes/testUserRoutes')
const bodyparser = require("body-parser")
const app=express()
app.use(express.json())

app.use(bodyparser.urlencoded({extended:true}));



// app.use("/api/v1", userRoutes)
app.use('/api/v1', testUserRoutes)

const DB_URL="mongodb://localhost:27017/usersdatabase";
mongoose.connect(DB_URL).then(()=>{console.log("Successfuly connected database")}).catch((error)=>{console.log(error)});






// server initailizing 
app.listen(5000,()=>{
    console.log(`Server is listening at port 5000`)
})