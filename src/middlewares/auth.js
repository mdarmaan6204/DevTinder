const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);
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
