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

const validateProfileEdit = (req) => {
  const allowedEditFileds = [
    "fname",
    "lname",
    "age",
    "photoUrl",
    "skills",
    "about",
  ];

  const isValidEdit = Object.keys(req.body).every((field) =>
    allowedEditFileds.includes(field)
  );
  return isValidEdit;
};

// const validateOldPassword = (req)

module.exports = { signUpValidation, validateProfileEdit };
