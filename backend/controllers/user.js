const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.createUser = (req, resp, next) => {
    console.log(req.body.email, req.body.password)
    bcrypt.hash(req.body.password, 10)  // hash the password for security before saving it
        .then(hash => {
            console.log('hash ' + hash);
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(result => {
                    resp.status(201).json({
                        message: 'User created',
                        result: result
                    });
                })
                .catch(err => {
                    resp.status(500)
                        .json({
                            message: 'Invalid Authentication Credentials'
                        });
                })
        })
};

exports.userLogin = (req, resp, next) => {
    let fetchedUser;
    User.findOne({email: req.body.email})
        .then(user => {
            console.log(user);
            if (!user) {
                return resp.status(401).json({
                    message: 'User not found'
                })
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password)
        })
        .then(compareResult => {
            if (!compareResult) {
                return resp.status(401).json({
                    message: 'User not authenticated'
                })
            }
            // User OK. Create and send token
            const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id},
                process.env.JWT_KEY,
                {expiresIn: '1h'});
            resp.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id
            });
        })
        .catch(err => {
            console.log(err)
            return resp.status(401).json({
                message: 'Invalid Authentication Credentials'
            })
        })
};
