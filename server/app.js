const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const PORT = 5005;

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();
// const cohorts = require("./cohorts.json");
// const students = require("./students.json");
const mongoose = require("mongoose");

//import the nmodels to CRUD
const CohortModel = require("./models/cohort.model");
const StudentModel = require("./models/student.model");

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

//Create Student Routes//
 app.post("/api/students", (req, res) => {
   CohortModel.create(req.body)
     .then((data) => {
       console.log("student added", data);
       res.status(201).json(data);
     })
     .catch((err) => {
       console.log(err);
       res.status(500).json({ errorMessage: err });
     });
  });


//Retrieves all of the students for a given cohort

app.get("/api/students/cohort/:cohortId", async (req, res)=>{
  try {
    const data = await StudentModel.find({cohort: req.params.cohortId}).populate(
      "cohort"
    )
    console.log("students found: ", data)
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: err });
  }
})

//Get Student Routes//
app.get("/api/students", async (req, res) => {
  try {
    const data = await StudentModel.find().populate(
      "cohort"
    );
    console.log("Students found");
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: err });
  }
});

//Update a  specific student by id//
app.put("/api/students/:studentId ", (req, res) => {
  const { studentID } = req.params;

  StudentModel.findByIdUpdate(studentID, req.body, { new: true }).populate(
      "cohort"
    );
  then((updateStudent) => {
    console.log("Student Updated", updateStudent);
    res.status(200).json(updateStudent);
  }).catch((err) => {
    console.log(err);
    res.status(500).json({ errorMessage: err });
  });
});

//Delete Student by ID

 app.delete("/api/students/:studentId", (req, res) => {
   StudentModel.findByIdAndDelete(req.params.studentId)
     .then((data) => {
       console.log("student deleted", data);
       res.status(200).json(data);
     })
     .catch((err) => {
       console.log(err);
     res.status(500).json({ errorMessage: err });
     });
 });

//Create Cohort Routes//

app.post("/api/cohorts", (req, res) => {
  CohortModel.create(req.body)
    .then((data) => {
      console.log("cohort added: ", data);
      res.status(201).json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ errorMessage: err });
    });
});

//get all Cohorts
app.get("/api/cohorts", async (req, res) => {
  try {
    const data = await CohortModel.find();
    console.log("Cohorts found: ", data);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    re.status(500).json({ errorMessage: err });
  }
});

//get a specific Cohort
app.get("/api/cohorts/:cohortId", async (req, res) => {
  try {
    const foundOneCohorts = await CohortModel.findById(req.params.petId);
    console.log("cohort found: ", foundOneCohorts);
    res.status(200).json(foundOneCohorts)
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: err });
  }
});

//Updates a specific cohort by id //
app.put("/api/cohorts/:cohortId", (req, res) => {
  const { cohortId } = req.params;

  Cohort.findByIdUpdate(cohortId, req.body, { new: true });
  then((updateCohort) => {
    console.log("Cohort Updated", updateCohort);
    res.status(200).json(updateCohort);
  }).catch((err) => {
    console.log(err);
    res.status(500).json({ errorMessage: err });
  });
});


//delete a cohort
app.delete("/api/cohorts/:cohortId", (req, res) =>{
  CohortModel.findByIdAndDelete(req.params.cohortId)
  .then((data)=>{
    console.log("cohort deleted: ", data);
    res.status(500).json(data);
  })
  .catch((err) => {
      console.log(err);
      res.status(500).json({ errorMessage: err });
    });
});

// ...

app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});
// app.get("/api/cohorts", (req, res) => {
//   res.status(200).json(cohorts);
// });

// app.get("/api/students", (req, res) => {
//   res.status(200).json(students);
// });

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
module.exports = app;