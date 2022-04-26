const express = require('express');
const mongoose = require('mongoose');
const Admin = require('./model/admin');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {requireAuth, checkUser} = require('./middleware/authMiddleware');
const CIT = require('./model/deparrtment/cit');
const COENG = require('./model/deparrtment/coeng');
const COE = require('./model/deparrtment/coe');


const app = express();

//middleware
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'ejs');

//database connection
//connection ni von link below
//const dbURI ='mongodb+srv://vctuciuk:test12@cluster0.gsket.mongodb.net/DIWAR?retryWrites=true&w=majority';
//connection sa wifi ni franz
const dbURI = 'mongodb+srv://vctuciuk:test123456@try.jetwc.mongodb.net/TRY?retryWrites=true&w=majority';
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => app.listen(2000))
    .catch((err) => console.log(err));

//handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {username:'', password:''};

    //password validation failed
    if (err.message === 'Password must be atleast 6 characters'){
        errors.password = 'Password must be atleast 6 characters';
    }

    //duplicate username error
    if (err.code === 11000) {
        errors.username = 'username already exist';
        return errors;
    }

    //login validation failed
    if(err.message === 'username or password is incorrect'){
        errors.username = 'username or password is incorrect';
        errors.password = 'username or password is incorrect';
    }
    //validation errors
    if (err.message.includes('adminSchema validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}

//jwtTokens
//Tokens Expiration
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({id}, 'Classified', {
        expiresIn: maxAge
    });
}

//routes
app.get('*', checkUser);

//load login page
app.get ('/', (req, res) => res.render('login'));

//load signup page
app.get ('/signup', (req, res) => res.render('signup'));

//login admin to homepage
app.post ('/' , async (req, res) => {
    const {username, password } = req.body;

    try {
        const admin = await Admin.login(username, password);
        const token = createToken(admin._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(200).json({ admin: admin._id })
    }
    catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({errors});
    }

})

//register new admin
app.post ('/signup', async (req, res) => {
    const {
        username,
        password,
    } = req.body;

    try{
        const user = await Admin.create({
            username,
            password,
        });
        //success
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(201).json({ user: user._id });
        console.log('success', user)   
    }
    catch (err){
        
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
    
})

//load account page
app.get('/account', requireAuth, (req, res) => {
    res.render('account')
})

//retrieve records from db
app.post('/search', async (req, res) => {
        const {department, date} = req.body;
        console.log(req.body)
     if (department === 'CIT') {
         CIT.find({date})
        .then((result)   => {
            console.log(result)
            res.render('result', result)
        })
        .catch(err => {
            console.log(err)
        })
     }
     else if (department === 'COENG') {
        COENG.find({date})
       .then((result)   => {
           console.log(result)
           res.render('result', result)
       })
       .catch(err => {
           console.log(err)
       }) 
    }
    else if (department === 'COE') {
        COE.find({date})
       .then((result)   => {
           console.log(result)
           res.render('result', result)
       })
       .catch(err => {
           console.log(err)
       }) 
    }
    else {
        console.log('wala di pede')
    }
        
    
    
})

//logout user from page
app.get('/logout', (req,res) => {
    res.cookie('jwt', '', {maxAge:1});
    res.redirect('/');
})
//return 404page
app.use((req, res) => res.status(404).render('404'));