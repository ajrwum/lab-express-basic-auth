const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  console.log('--- --- GET --- /');
  res.render("index");
});


/* GET main page */
router.get("/main", (req, res, next) => {
  console.log('--- --- GET --- /main');
  res.render("main");
});


/* GET private page */
router.get("/private", (req, res, next) => {
  console.log('--- --- GET --- /private');
  res.render("private");
});


module.exports = router;
