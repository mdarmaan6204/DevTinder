const adminAuth = (req, res, next) => {
    // Check for is user is admin or not
    const token = "xyz";
    if (token !== "xyz") {
      res.status(401).send("You are not admin");
    }
    next();
  }

module.exports = {adminAuth};  