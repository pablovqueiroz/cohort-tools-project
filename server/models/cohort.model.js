const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cohortSchema = new Schema({
    inProgress: {
        type: Boolean
    },
    cohortSlug: {
        type: String
    },
    cohortName: {
        type: String,
        required: true
    },
    program: {
        type: String,
        enum: ["Data Analytics", "UX/UI", "Web Dev", "Cybersecurity"]
    },
    campus: {
        type: String,
        enum: ["Madrid", "Barcelona", "Miami", "Paris", "Berlin", "Amsterdam", "Lisbon", "Remote"]
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
    },
    programManager: {
        type: String
    },
    leadTeacher: {
        type: String
    },
    totalHours: {
        type: Number
    }
    
});


const CohortModel = mongoose.model("cohort", cohortSchema);

//export the model
module.exports = CohortModel;