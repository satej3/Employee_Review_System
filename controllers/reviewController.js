

const reviewModel = require('../models/reviewModel');
const employeeModel = require('../models/employeeModel');

// get all employees
const get_all_reviews = async(req,res) => {
    try {
        const list = await reviewModel.find({}).populate('reviewForEmpId');;
        console.log("all reviews = ", list);

        res.render('review_list', {list} );
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
const save_review= async(req,res) => {
    try {
        const newReview = await reviewModel.create(req.body);
        console.log("Saved Review = ", newReview);

        const list = await reviewModel.find({});
        res.redirect('/reviews' );
    } catch (error) {
        console.error("Error Occured : ", error);
            res.status(500).json({
                success: false,
                message : 'Internal Server Error..',
                error
            });
    }
}

// 
// const update_employee = async(req,res) => {
//     try {
//         const updatedEmployee = await employeeModel.updateOne({ _id: req.params.id }, { $set: req.body });
//         console.log("empdated Employee = ", updatedEmployee);
//         const list = await employeeModel.find({});
//         res.render('employee_list', {list} );
//     } catch (error) {
//         console.error("Error Occured : ", error);
//         res.status(500).json({
//             success: false,
//             message : 'Internal Server Error..',
//             error
//         });
//     }
// }

// // get one employee
const get_review_of_employee = async(req,res) => {
    try {
        const reviews = await reviewModel.find({ reviewForEmpId: req.params.id });
        // console.log("found reviews = ", reviews);
        return reviews;
    } catch (error) {
        console.error("Error Occured : ", error);
        res.status(500).json({
            success: false,
            message : 'Internal Server Error..',
            error
        });
    }
}

//get all reviews for provided employee id
const get_all_reviews_for_employee_id = async (req,res) => {
    try {
        const list = await reviewModel.find({reviewForEmpId : req.params.id});
        console.log("all reviews = ", list);

        res.render('review_list', {list} );
    } catch (error) {
        console.error("Error Occured : ", error);
        res.status(500).json({
            success: false,
            message : 'Internal Server Error..',
            error
        });
    }
}

// get azll reviews by provided employee id
const get_all_reviews_By_employee_id = async (req,res) => {
    try {
        const list = await reviewModel.find({reviewByEmpId : req.params.id});
        console.log("all reviews = ", list);

        res.render('review_list', {list} );
    } catch (error) {
        console.error("Error Occured : ", error);
        res.status(500).json({
            success: false,
            message : 'Internal Server Error..',
            error
        });
    }
}

const save_review_by_employee = async(req,res) => {
    try {
        console.log("request data we got = ", req.body)
        const employeeWhoGivenReview = await employeeModel.findOne({ _id : reviewByEmpId});
        console.log("emp = ", employeeWhoGivenReview);
        employeeWhoGivenReview.colleaguesId.pop();
        if(employeeWhoGivenReview.colleaguesId.length > 0){

        }else{

        }

        // const newReview = await reviewModel.create(req.body);
        // console.log("Saved Review = ", newReview);

        const list = await reviewModel.find({});
        res.redirect('/reviews' );
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
    get_all_reviews,
    save_review,
    get_review_of_employee,
    get_all_reviews_for_employee_id,
    get_all_reviews_By_employee_id,
    save_review_by_employee,

}

