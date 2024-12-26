const express = require("express");
const app = express();
const connectDb = require("./config/database");
const { signUpValidation } = require("./utils/validations");
const User = require("./models/user");

app.use(express.json());



app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES_FIELDS = [
      "fname",
      "lname",
      "age",
      "skills",
      "password",
      "about",
      "photoUrl",
    ];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES_FIELDS.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error(" Update not allowed");
    }
    if (data.skills?.length > 10) {
      throw new Error("SKills should not be more than 10");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
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
