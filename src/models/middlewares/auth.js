const jwt = require("jsonwebtoken");
const User = require("../user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized access." });
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
