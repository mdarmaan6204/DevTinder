const express = require("express");
const app = express();
const connectDb = require("./config/database");

const User = require("./models/user");

app.use(express.json());

// Fetching user with specific email
app.get("/user" , async (req , res) => {
  const userEmail = req.body.email;
  try{
    const users = await User.find();
    if(users.length === 0)
      res.status(404).send("No user found with this email");
    else
    res.send(users);
  }
  catch(error){
    res.send("Something went wrong" + error.message);
  }
})

app.post("/signup" , async (req , res) => {

  console.log(req.body);
    const userObj = new User(req.body);

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
