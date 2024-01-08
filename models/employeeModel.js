// fields
// employee name
// user name / email
// password
// mobile
// isAdmin
// isReviewAssigned
// list of anotherEmployeeId whose review i should give
// 

const mongoose = require('mongoose');

const employeeSchema = mongoose.Schema({
    empName : {type : String},
    userName : {type: String},
    password: {type: String},
    mobileNo: {type: String},
    isAdmin : {type: Boolean},
    isReviewAssgned : {type: Boolean},
    colleaguesId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    }]

}, {timestamps : true});


const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
