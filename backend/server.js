require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Student = require("./models/Student");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/students/:registerNumber", async (req, res) => {
  try {
    const student = await Student.findOne({
      registerNumber: req.params.registerNumber
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({
      message: "Error finding student",
      error: error.message
    });
  }
});
// Add a student
app.post("/api/students", async (req, res) => {
  try {
    const student = new Student(req.body);

    const savedStudent = await student.save();

    res.status(201).json({
      message: "Student added successfully",
      student: savedStudent
    });
  } catch (error) {
    console.log("Error adding student:", error.message);

    res.status(500).json({
      message: "Error adding student",
      error: error.message
    });
  }
});
app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching students",
            error: error.message
        });
    }
});
// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection error:");
    console.log(error.message);
  });

// Start server
const PORT = process.env.PORT || 5000;
app.get("/students/:registerNumber", async (req, res) => {
  try {
    const student = await Student.findOne({
      registerNumber: req.params.registerNumber
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({
      message: "Error finding student",
      error: error.message
    });
  }
});
app.get("/", (req, res) => {
    res.send("Attendance Tracker Backend is Running!");
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});