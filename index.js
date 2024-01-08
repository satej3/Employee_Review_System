// Import reuired modules
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const db = require('./config/mongoose');
const router = require('./routes/router');
const employeeController = require('./controllers/employeeController');
const reviewsController = require('./controllers/reviewController');
const empModel = require('./models/employeeModel');


// define port
const port = 5002;

// Creating express object
const app = express();

// Server Setup
app.listen(port,console.log(`Server started on port ${port}`));

//set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views') );
app.use('/assets', express.static('assets'));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Use sessions for tracking logins
app.use(session({
    secret: 'saty',
    resave: false,
    saveUninitialized: true,
}));
//use router
app.use(router);


app.get('/', (req,res) => { res.render('login', {message : ''})} );
// employee list page
app.get('/employees', (req,res) => { res.redirect('/employee_list')} );
// addEmployee form
app.get('/employees/addEmployee', (rew,res) => {res.render('addEmployee')});
// update employee form
app.get('/employee/updateEmployee/:id', async (req,res,next) => {
    const employeeDetails = await employeeController.get_employee(req, res);
    console.log("selected employee to update = ", employeeDetails);
    return res.render('updateEmployee', {employee : employeeDetails});
});
// employee details page
app.get('/employee/details/:id', async(req,res) => {
    const employeeDetails = await employeeController.get_employee(req, res);
    const reviewsForThisEmployee = await reviewsController.get_review_of_employee(req,res);
    console.log("selected employee to update = ", employeeDetails, reviewsForThisEmployee);
    res.render('employeeDetails', {employee : employeeDetails, reviews : reviewsForThisEmployee});
    // res.render('')
});

// Reviews list page
// app.get('/reviews', (req, res) => {res.render('review_list')} );
app.get('/reviews', (req, res) => {res.redirect('/getAllReviews')} );
// add Review form
app.get('/reviews/giveReview', async(req,res,next) => {
    const employees = await employeeController.get_employees_for_selection();
    console.log("employees = ", employees);
    res.render('addReview', {employees});
});
// see employees reviews
app.get('/reviews/getReviews', (req,res) => {res.render('getReviews')});

app.get('/assignReview/:id', async (req, res) => {
    const employees = await employeeController.get_employees_for_selection();
    res.render('assign_review', {employees, id:req.params.id});
} );

app.get('/employee/home', async(req,res) => {//:id
    // const adminRights = isAdminRights(req,res);
    const adminRights = req.session.isAdmin;
    if(!adminRights){
    req.params.id = req.session.userId;
    console.log("req.params.id = ", req.params.id);
    //fetch all reviews this employee got from other employees..
    const reviewsForThisEmployee = await reviewsController.get_review_of_employee(req,res);
    // fetch all employees assigned to this employee to give review to them.
    const pendingReviewList = await employeeController.get_employees_assigned_reviews(req,res);
    console.log("pending list = ", pendingReviewList);
    res.render('employee_home', {reviews : reviewsForThisEmployee, employees : pendingReviewList, message : ''});
    }
    else{
        res.render('employee_home', {message : 'Oops!! You dont have permission to view this page.'})
    }
})

app.get('/employee/home/giveReview/:id', async (req,res) => {
    const adminRights = req.session.isAdmin;
    console.log("admin rights = ", adminRights);
    if(!adminRights ){
    const employee = await employeeController.get_employee(req,res);
    res.render('giveReviewForEmployee',{employee : employee, message : ''});
    }else{
        res.render('giveReviewForEmployee', {message : 'Oops!! You dont have permission to view this page.'});
    }
})

app.get('/employee/deleteEmployee/:id', async (req,res) => {
    const adminRights = req.session.isAdmin;
    console.log("admin rights = ", adminRights);
    if(adminRights ){
        const employee = await employeeController.get_employee(req,res);
        res.render('deleteEmployee',{employee : employee, message : ''});
    }else{
        res.render('deleteEmployee', {message : 'Oops!! You dont have permission to view this page.'});
    }
})

app.get('/header', (req, res) => {
    console.log("heADER  api called..")
    console.log('Session data:', req.session);
    const headerData = {
        userName: req.session.userName,
        userId: req.session.userId,
        isAdmin: req.session.isAdmin
      };
      res.json(headerData);
  });

app.get('/login', (req,res) => { res.render('login', {message : ''})} );

app.post('/login', async (req, res) => {
    const { userName, password } = req.body;
	console.log(userName , password);

    // Find the user by username in the database
    const user = await empModel.find( { userName : userName });

	console.log("===========================================================");
	console.log("user found = ", user);
	console.log("===========================================================");

    if (!user) {
		console.log('user not found..');
        // User not found, render login page with an error message
        return res.render('login', { message: 'Invalid username or password' });
    } else {
        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, user[0].password);
		console.log("passwordMatch =", passwordMatch);
        if (passwordMatch) {
			req.session.userName = userName;
			req.session.password = password;
            req.session.userId = user[0]._id;
            req.session.isAdmin = user[0].isAdmin;
            // Passwords match, user is authenticated
            console.log(req.session.userName);
            console.log(req.session.password);
            console.log(req.session.userId);
            console.log(req.session.isAdmin);
            if(user[0].isAdmin)
                return res.redirect('/employees');
            else
                return res.redirect('/employee/home');

        } else {
			console.log('password didnt matched..')
            // Passwords do not match, render login page with an error message
            return res.render('login', { message: 'Invalid username or password' });
        }
    }
});

app.get('/logout', (req, res) => {
    // Clear the session variable on logout
    req.session.destroy(err => {
        if (err) {
            console.error(err);
        }
        res.redirect('/login');
    });
});

// const isAdminRights = async (req, res) => {
//     const emp = employeeController.get_employee(req, res);
//     if(!emp)
//         return false;
//     else
//         return emp.isAdmin;
// }



