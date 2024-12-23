const express = require("express");

const app = express();

app.use("/",(req, res) =>{
    res.send("hello from server");
})

app.use("/test",(req, res) =>{
    res.send("hello from server test");
})

app.use("/hello",(req, res) =>{
    res.send("hello from server hello hello hello");
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
