const express = require("express");
const app = express();
const connectDb = require("./config/database");

const User = require("./models/user");
app.use(express.json());

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;

  try {
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
    });
    console.log(user);
    res.send("User updated successfully");
  } catch (err) {
    res.send("Something went wrong" + err.message);
  }
});

// Deleting user by id
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (user === null) res.status(404).send("No user found with this id");
    else res.send("User deleted successfully");
  } catch (err) {
    res.send("Something went wrong" + err.message);
  }
});

// Fetching user with specific email
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const users = await User.find();
    if (users.length === 0)
      res.status(404).send("No user found with this email");
    else res.send(users);
  } catch (error) {
    res.send("Something went wrong" + error.message);
  }
});

app.post("/signup", async (req, res) => {
  console.log(req.body);
  const userObj = new User(req.body);

  try {
    // Saving the user object to the database
    await userObj.save();
    res.send("User added Successfully");
  } catch (error) {
    res.send(error.message);
  }
});

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

