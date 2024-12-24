const express = require("express");

const app = express();

const {adminAuth} = require("./middlewares/auth");
app.use("/admin", adminAuth);
app.get("/admin/user", (req, res) => {
  res.send("You are admin and get the user");
});

app.get("/admin/delete", (req, res) => {
  res.send("You are admin and user is deleted");
});

app.use(
  "/user",
  (req, res, next) => {
    // Saving the data to DB
    // res.send("Response from the first middleware");
    next();
  },
  (req, res) => {
    res.send("Response from the second middleware");
  }
);

app.get("/user", (req, res, next) => {
  console.log(" 1st Router handler");
  next();
});
app.get("/user", (req, res, next) => {
  console.log(" 2nd Router handler");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
