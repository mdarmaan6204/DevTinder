const validator = require("validator");

const signUpValidation = (req) => {
  const { fname, lname, email, password } = req.body;
  if (!fname || !lname) {
    throw new Error("Enter a valid name");
  } else if (!validator.isEmail(email)) {
    throw new Error("Enter a valid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }
};

module.exports = { signUpValidation };
