const jwt = require('jsonwebtoken');
const Admin = require('../model/admin');

const requireAuth = (req, res, next) => {
    const token  = req.cookies.jwt;

    //check if token exist and verified
    if (token) {
        jwt.verify(token, 'Classified', (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/');
            } else {
                console.log(decodedToken);
                next();
            }
        })
    } else {
        res.redirect('/');
    }
}

//check current user
const checkUser = (req, res, next) =>{
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'Classified', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.admin = null;
                next();
            } else {
                console.log(decodedToken);
                let admin = await Admin.findById(decodedToken.id);
                res.locals.admin = admin;
                next();
            }
        })
    }
    else {
        res.locals.user = null;
        next();
    }
}

module.exports = {requireAuth, checkUser};