const mongoose = require("mongoose")
const DB_Name = "t"

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://fa21bcs090:flgiTGUARXBeAoFj@cluster0.cjzvnqu.mongodb.net/${DB_Name}`)
        console.log(`${DB_Name}`)
        console.log("Mongodb connected");
    } catch (error) {
        console.log("Mongodb connection error",error);
        process.exit(1);
    }
}

module.exports = connectDB