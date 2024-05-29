require('dotenv').config();
const port = process.env.PORT || 3000;
const connectDB = require("./db/index.js");
const app = require('./app.js');

connectDB()
.then(() => {
    app.listen(port, () => {
        console.log(`Listening on port : ${port}`);
    });
})
.catch((err) => {
    console.log("Mongodb connection failed", err);
});

// Error handling middleware
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res.status(err.status || 500).json({ error: err.message || 'Server Error' });
});
