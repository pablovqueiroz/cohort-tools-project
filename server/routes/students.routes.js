const router = require("express").Router();
const StudentModel = require("../models/Student.model");

//Create Student Routes//
router.post("/", (req, res) => {
  StudentModel.create(req.body)
    .then((data) => {
      console.log("student added", data);
      res.status(201).json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ errorMessage: err });
    });
});

//Get all Students Routes//
router.get("/", async (req, res) => {
  try {
    const data = await StudentModel.find().populate("cohort");
    console.log("Students found");
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: err });
  }
});

//Retrieves all of the students for a given cohort

router.get("/cohort/:cohortId", async (req, res) => {
  try {
    const data = await StudentModel.find({
      cohort: req.params.cohortId,
    }).populate("cohort");
    console.log("students found: ", data);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: err });
  }
});

//Get a  specific student by id//
router.get("/:studentId", async (req, res) => {
  try {
    const data = await StudentModel.findById(req.params.studentId);
    console.log("Student found");
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: err });
  }
});

//Update a  specific student by id//
router.put("/:studentId", (req, res) => {
  const { studentId } = req.params;
  StudentModel.findByIdAndUpdate(studentId, req.body, { new: true })
    .populate("cohort")
    .then((updateStudent) => {
      console.log("Student Updated", updateStudent);
      res.status(200).json(updateStudent);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ errorMessage: err });
    });
});

//Delete Student by ID

router.delete("/:studentId", (req, res) => {
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

module.exports = router;
