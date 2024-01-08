// fields
// review For employeeId
// reviewDetails
// review given by employeeId 
// reviewDate 
// 

const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    reviewDetails : {type : String},
    reviewForEmpId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
    },
    reviewByEmpId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
    }

}, {timestamps : true});


const Employee = mongoose.model('Review', reviewSchema);
module.exports = Employee;
