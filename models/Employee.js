const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobileNo: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    course: {
        type: [String],
        required: true,
    },
    imgUpload: {
        type: String,
        required: true,
    },
    createDate: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Employee', EmployeeSchema);
