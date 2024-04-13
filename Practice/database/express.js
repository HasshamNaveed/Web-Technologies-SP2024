const express = require("express");
const mongoose = require("mongoose");
let server = express();
server.listen(4000,() => {
    console.log("server started listening at localhost:4000")
});
mongoose.connect("mongodb://localhost:27017/fa21-bcs-a")
console.log("Db connected");
