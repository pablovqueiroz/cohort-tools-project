const router = require("express").Router();
const CohortModel = require("../models/Cohort.model");

//Create Cohort Routes//
router.post("/", (req, res) => {
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
router.get("/", async (req, res) => {
  try {
    const data = await CohortModel.find();
    console.log("Cohorts found: ", data);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: err });
  }
});

//get a specific Cohort
router.get("/:cohortId", async (req, res) => {
  try {
    const foundOneCohorts = await CohortModel.findById(req.params.cohortId);
    console.log("cohort found: ", foundOneCohorts);
    res.status(200).json(foundOneCohorts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: err });
  }
});

//Updates a specific cohort by id //
router.put("/:cohortId", (req, res) => {
  const { cohortId } = req.params;
  CohortModel.findByIdAndUpdate(req.params.cohortId, req.body, { new: true })
    .then((updateCohort) => {
      console.log("Cohort Updated", updateCohort);
      res.status(200).json(updateCohort);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ errorMessage: err });
    });
});

//delete a cohort
router.delete("/:cohortId", (req, res) => {
  CohortModel.findByIdAndDelete(req.params.cohortId)
    .then((data) => {
      console.log("cohort deleted: ", data);
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ errorMessage: err });
    });
});
module.exports = router;