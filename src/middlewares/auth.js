const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is invalid!!!!");
    }

    const decodedObj = await jwt.verify(token, "dev@tinder123");
    const { _id } = decodedObj;

    const user = await User.findById(_id);

    if (!user) {
      throw new Erorr("User not exists.");
    }
    req.user = user;    
    next();
  } catch (err) {
    res.status(400).send("Error : " + err);
  }
};

module.exports = { userAuth };
