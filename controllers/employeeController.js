
const employeeModel = require('../models/employeeModel');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

// get all employees
const get_all_employees = async(req,res,next) => {
    try {
        const list = await employeeModel.find({});
        // console.log("all employees = ", list);
        res.render('employee_list', {list : list, userName: req.session.userName,
            userId: req.session.userId,
            isAdmin: req.session.isAdmin} );
    } catch (error) {
        console.error("Error Occured : ", error);
            res.status(500).json({
                success: false,
                message : 'Internal Server Error..',
                error
            });
    }
};

// save new employee
const save_employee = async(req,res,next) => {
    console.log("controller hit = ", req.body);
    try {
        const existingEmployee = await employeeModel.findOne({empName: req.body.empName});
        console.log("is existing = ", existingEmployee);
        if(!existingEmployee){
            let obj = req.body;
            obj.isReviewAssgned = false;
            const saltRounds = 5;
            let newPassword = await bcrypt.hash(req.body.password, saltRounds);
            obj.password = newPassword;
            const newEmployee = await employeeModel.create(obj);
            console.log("Saved Employee = ", newEmployee);
        }
        const list = await employeeModel.find({});
        res.render('employee_list', {list} );
    } catch (error) {
        console.error("Error Occured : ", error);
            res.status(500).json({
                success: false,
                message : 'Internal Server Error..',
                error
            });
    }
}

//update existing employee
const update_employee = async(req,res,next) => {
    try {
        let obj = req.body;
        const saltRounds = 5;
        let newPassword = await bcrypt.hash(req.body.password, saltRounds);
        obj.password = newPassword;
        const updatedEmployee = await employeeModel.updateOne({ _id: req.params.id }, { $set: obj });
        console.log("empdated Employee = ", updatedEmployee);
        return res.redirect('/employees')
    } catch (error) {
        console.error("Error Occured : ", error);
        res.status(500).json({
            success: false,
            message : 'Internal Server Error..',
            error
        });
    }
}

// get one employee
const get_employee = async(req,res, next) => {
    try {
        const employee = await employeeModel.findOne({ _id: req.params.id });
        console.log("empdated Employee = ", employee);
        if(!employee)
            return 'Employee details not found..';
        else
        return employee;
            // return res.render('employeeDetails', {employee : employee} );
    } catch (error) {
        console.error("Error Occured : ", error);
        res.status(500).json({
            success: false,
            message : 'Internal Server Error..',
            error
        });
    }
}

//return all employees for review selection
const get_employees_for_selection = async (req, res) =>{
    try {
        const list = await employeeModel.find({});
        return list;
    } catch (error) {
        console.error("Error Occured : ", error);
            res.status(500).json({
                success: false,
                message : 'Internal Server Error..',
                error
            });
    }
}

// assign review to the employee- basically update
const assign_review_to_employee= async(req,res) => {
    try {
        const employee = await employeeModel.findOne({ _id: req.params.id });
        employee.isReviewAssgned = true;
        const colleaguesId = req.body.reviewForEmpId;
        console.log("id we got = ",  colleaguesId)
        employee.colleaguesId.push(new ObjectId(colleaguesId));
        console.log("new data = "+ employee);
        employee.save();
        console.log("assigned review to Employee = ", employee);
        return res.redirect('/employees');
    } catch (error) {
        console.error("Error Occured : ", error);
            res.status(500).json({
                success: false,
                message : 'Internal Server Error..',
                error
            });
    }
} 

const get_employee_id_by_employee_name = async(req,res) => {
    try {
        const employee = await employeeModel.findOne({ username: username });
        return employee.id;
    } catch (error) {
        console.error("Error Occured : ", error);
            res.status(500).json({
                success: false,
                message : 'Internal Server Error..',
                error
            });
    }
}

// get reviews assigne to selected employee..
const get_employees_assigned_reviews = async (req,res) => {
    try {
        const employee = await employeeModel.findOne({ _id: req.params.id });
        let pendingReviewsList = [];
        if(employee.isReviewAssgned == true && employee.colleaguesId){
            const promises = employee.colleaguesId.map(async emp => {
                const emp1 = await employeeModel.findOne({ _id: emp });
                return emp1;
              });
            pendingReviewsList = await Promise.all(promises);
        }
        // console.log("reviews to be given list = ", pendingReviewsList);
        return pendingReviewsList;
    } catch (error) {
        console.error("Error Occured : ", error);
            res.status(500).json({
                success: false,
                message : 'Internal Server Error..',
                error
            });
    }
}

const deleteEmployee = async (req, res) => {
    try {
        // Use mongoose to delete the record with the specified ID
			const deletedStudent = await employeeModel.deleteOne({ _id: req.params.id });
			console.log(deletedStudent);
            const list = await employeeModel.find({});
			// Redirect to the page displaying the remaining records
			res.redirect('/employee_list');
    } catch (error) {
        console.error("Error Occured : ", error);
            res.status(500).json({
                success: false,
                message : 'Internal Server Error..',
                error
            });
    }
}

module.exports = {
    get_all_employees,
    save_employee,
    update_employee,
    get_employee,
    get_employees_for_selection,
    assign_review_to_employee,
    get_employee_id_by_employee_name,
    get_employees_assigned_reviews,
    deleteEmployee,
}

