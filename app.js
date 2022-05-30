const express = require('express')
const cors = require('cors');
const app = express();
app.use(cors());

app.use(express.json());
require('dotenv').config()
const mongoose = require("mongoose");
app.use(express.json());
const userRoute = require("./routes/user")
app.use("/api", userRoute)


app.use("/", (req, res)=> {
    return res.status(404).json({"result":"path not found"})
})

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to DB"))
    .catch (console.error);

app.listen(3000, ()=>{
    console.log("Server UP")
})
