const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: String,
    email: String,
    department: String,
    year: Number,
    registerNumber: String
});

module.exports = mongoose.model("Student", studentSchema);