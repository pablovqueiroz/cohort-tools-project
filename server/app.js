const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const PORT = 5005;

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();
const mongoose = require("mongoose");

//import the nmodels to CRUD
const CohortModel = require("./models/Cohort.model");
const StudentModel = require("./models/Student.model");
const UserModel = require("./models/User.model");

mongoose
  .connect("mongodb://127.0.0.1:27017/mini-project")
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);
// ...
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// handling routes here
const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);
const cohortsRoutes = require("./routes/cohorts.routes");
app.use("/cohorts", cohortsRoutes);
const studentsRoutes = require("./routes/students.routes");
app.use("/students", studentsRoutes);

// ...

app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

const {
  errorHandler,
  notFoundHandler,
} = require("./middlewares/error-handling");

app.use(notFoundHandler);
app.use(errorHandler);

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
module.exports = app;
