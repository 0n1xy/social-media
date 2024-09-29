const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username : {type : String},
    password : {type : String},
    sex : {type : String},
    firstName: {type : String},
    lastName: {type : String},
    dayOfBirth : {type : Date},
    email : {type : String},
    profile_picture : {type : String},
    biography : {type : String}
},
{
    timestamps : true
});

module.exports = mongoose.model('user', UserSchema);