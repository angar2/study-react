const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10   // 암호화 자릿수
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})
// index.js - /register route에서 유저 정보를 mongoDB에 저장하기 전에 실행하게함
// pre: moogoose의 method
userSchema.pre('save', function(next) {
    var user = this;
    if (user.isModified('password')) {      // user 정보 중 password 변경 시에만 다시 실행되도록 함
        bcrypt.genSalt(saltRounds, function(err, salt) {       // 암호화할 수 있도록 salt 생성
            if (err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash) {     // password 암호화 = hash
                if (err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})
// bcrypt를 이용해서 password를 비교하는 method
userSchema.methods.comparePassword = function(plainPassword, cb) {
    // 요청된 password를 암호화하여 mongoDB상 password와 비교.
    // compare: bcrypt의 method
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    })
}
// jsonwebtoken을 이용해서 token을 생성하는 method
userSchema.methods.generateToken = function(cb) {
    var user = this;
    // token = user.id + scretToken
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save(function(err, user) {
        if (err) return cb(err)
        cb(null, user)
    })
}
// jsonwebtoken을 이용해서 token을 decoding하여 'user_id'가 일치하는지 확인하는 method
userSchema.statics.findByToken = function(token, cb) {
    var user = this;
    // decoding 결과로 나올 정보 = 'user_id'
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // decoding 결과와 client의 token이 mongoDB에 저장되어있는지 확인. 
        user.findOne({ "_id": decoded, "token": token }, function(err, user) {
            if (err) return cb(err);
            cb(null, user) 
        })
    })
}

const User = mongoose.model('User',userSchema)

module.exports = { User }