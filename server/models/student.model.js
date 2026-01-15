const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required:true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    phone:{
        type: Number,
    },
    linkedinUrl: {
        type: String,
    },
    languages: {
        type: String,
        enum: ["English", "Dutch", "Portuguese", "Spanish", "German", "French"]
    },
    program: {
        type: String,
        enum: ["Data Analytics", "UX/UI", "Web Dev"]
    },
    background:{
        type: String,
    },
    image:{
        type: String,
        default:"https://i.imgur.com/r8bo8u7.png"
    },
    cohort: {
    type: Schema.Types.ObjectId,
    ref: "cohort",
  },
    projects: {
        type: [String]
    }
});


const StudentModel = mongoose.model("student", studentSchema);

//export the model
module.exports = StudentModel;