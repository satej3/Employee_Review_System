
const router = require('express').Router();
const employeeController = require('../controllers/employeeController');
const reviewController = require('../controllers/reviewController');

//get employee list
router.get('/employee_list', employeeController.get_all_employees);

//add employee
router.post('/add_employee', employeeController.save_employee );

//update employee
router.post('/update_employee/:id', employeeController.update_employee);

//get one employee
router.get('/get_employee/:id', employeeController.get_employee);

// delete one employee
router.post('/deleteEmployee/:id', employeeController.deleteEmployee);

//get all employee's reviews
router.get('/getAllReviews', reviewController.get_all_reviews);

//get selected employees all reviews
router.get('/getReviewsForEmployee/:id', reviewController.get_review_of_employee);

//save new review
router.post('/addReview', reviewController.save_review);

router.post('/assign_review/:id', employeeController.assign_review_to_employee)

//this is review given by employee to another employee..
//here we need to remove colleagues id from the employee who is given the review.
//so that he wont see that employee again in the list on UI.
router.post('/reviewByEmployee/:id', reviewController.save_review_by_employee);

module.exports = router;