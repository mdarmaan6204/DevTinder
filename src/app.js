const express = require("express");
const app = express();
const connectDb = require("./config/database");

const User = require("./models/user");

app.post("/signup" , async (req , res) => {

  // Creating a instance of User model
  const userObj = new User({
    name: "Swati",
    age : 22, 
    email: "swati@gmail",
    gender : "female",
    password: "swati@123",
  });

  try {
    // Saving the user object to the database
    await userObj.save();
    res.send("User added Successfully");
  } catch (error) {
    res.send(error.message);
  }
  
})

connectDb()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Error connecting to database", err);
  });
