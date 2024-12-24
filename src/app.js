const express = require("express");

const app = express();



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

app.use("/" , (err , req , res , next)=>
{
    if(err)
    {
        res.status(500).send("Something went wrong");
    }
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
