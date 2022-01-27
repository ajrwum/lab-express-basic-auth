const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');

const User = require('./../models/User.model');

// - logout
router.get("/logout", (req, res, next) => {
  console.log('--- --- GET --- /logout');
  // destroy the session on logout so private routes remain private
  req.session.destroy(function(err) {
    // cannot access session here
  })
  res.redirect('/login');
});

// - display the signup form
router.get('/signup', (req, res, next) => {
  console.log('--- --- GET --- /signup');
  res.render('auth/signup');
});

// - register a new user
router.post('/signup', async (req, res, next) => {
  console.log('--- --- POST --- /signup');
  try {
    // get the user's input (req.body)
    const { username, password } = req.body;
    // check if both fields are ok
    if (!username || !password) {
      console.error('Missing username or password');
      res.redirect('/signup');
    }
    else {
      // check if username already known in db
      const foundUser = await User.findOne({ username: username});
      if (foundUser) {
        console.log ("Username already registered");
        res.redirect('/login');
      }
      else {
        // hash + salt the password
        const hashedPwd = bcrypt.hashSync(username, 10);
        const newUser = { username, password: hashedPwd};
        // create the user in db
        await User.create(newUser);
        // redirect to /signin to log in
        res.redirect('/login');
      }
    }
  }
  catch (error) {
    console.error(error);
    res.redirect('/signup');
  }
});

// - display the login form
router.get('/login', (req, res, next) => {
  console.log('--- --- GET --- /login');
  res.render('auth/login.hbs');
});

// - actually login the user in session
router.post('/login', async (req, res, next) => {
  console.log('--- --- POST --- /login');
  try {
    // get user's input
    const newUser = { username: req.body.username, password: req.body.password };
    // check if field missing
    if (!newUser.username || !newUser.password) {
      throw new Error('Username or password missing');
    }
    else {
      // check if already logged in
      const foundUser = await User.findOne({ username: newUser.username});
      if (foundUser) {
        console.log('User found in db, checking password...');
        // check password
        const isPwdOk = bcrypt.compareSync(newUser.password, foundUser.password)
        if (isPwdOk) {
          console.log('User password ok');
          // create the currentUser in session (using foundUser to get his _id from db)
          delete newUser.password;
          req.session.currentUser = foundUser;
          // redirect the user to the main page
          res.redirect('/main');
        }
        else {
          console.error('Invalid password');
          throw new Error('Invalid password');
        }
      }
      else {
        // not in db
        console.log('User not in db, redirect to register page');
        res.redirect('/signup');
      }
    }
    // 
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;