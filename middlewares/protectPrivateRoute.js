module.exports = function protectPrivateRoute(req, res, next) {
  if (!req.session.isLoggedIn) {
    // a user not already logged in will be redirected to login page
    console.log('--- Please login to access this page.')
    res.redirect('/');
  }
  else next();
}