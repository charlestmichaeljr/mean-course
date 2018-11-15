const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

router.post("/signup", (req, resp, next) => {
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
              message: err
            });
        })
    })
});

router.post("/login", (req, resp, next) => {
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
      const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id},
        'Now_is_the_time_for_all_good_men_to_come_to_the_aid_of_their_party',
        {expiresIn: '1h'});
      resp.status(200).json({
          token: token,
          expiresIn: 3600
      });
    })
    .catch(err => {
      console.log(err)
      return resp.status(401).json({
        message: 'Other error',
        error: err
      })
    })
});

module.exports = router;
