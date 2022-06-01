const express = require('express')
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config()
const mongoose = require("mongoose");
app.use(express.json());

const userRoute = require("./routes/user")
const roomRoute = require("./routes/room")
const betRoute = require("./routes/bet")
const pronosticRoute = require("./routes/pronostic")
const cloudinary = require("cloudinary");
app.use("/api", userRoute, roomRoute, betRoute, pronosticRoute)


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", process.env.ENVIRONMENT_DOMAIN)
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
        next()
})

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to DB"))
    .catch (console.error);

app.listen(3001, ()=>{
    console.log("Server UP")
})
