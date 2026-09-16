const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/employees')
    const db = mongoose.connection;
    db.on("connected", () => {
        console.log("Connected to MongoDB");
    });
    db.on("disconnected", () => {
        console.log("Disconnected from MongoDB");
    });
    db.on("error", (err) => {
        console.log("Error connecting to MongoDB", err);
    });

    module.exports = db;