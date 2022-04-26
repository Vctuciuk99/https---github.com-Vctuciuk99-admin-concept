const mongoose = require('mongoose');
const bcrpyt = require('bcrypt');

const adminSchema = new mongoose.Schema({
    username:{
        type: String, 
        required: true, 
        unique: true
    },
    password:{
        type: String, 
        required: true,
        minlength: [6, 'Password must be atleast 6 characters']
    }
},{collection: 'ADMIN'})

//fire a function before doc save too db
adminSchema.pre('save', async function (next) {
    const salt = await bcrpyt.genSalt();
    this.password = await bcrpyt.hash(this.password, salt);
    next();
});

//static method to login user
adminSchema.statics.login = async function(username, password) {
    const admin = await this.findOne({ username });
    if (admin) {
        const auth = await bcrpyt.compare(password, admin.password);
        if (auth) {
            return admin;
        }
        throw Error('username or password is incorrect');
    }
    throw Error('username or password is incorrect');
}

const model = mongoose.model('adminSchema', adminSchema)
module.exports = model;