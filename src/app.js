const express = require("express");

const app = express();

app.get("/user/:userId/:name/:age" , (req , res)=> {
    console.log(req.params);
    res.send({name:"Malik" , age:21})
});

app.post("/user" , (req, res)=>{
    // Saving the data to DB
    res.send("Data has been saved to DB Successfully");
})

app.delete("/user" , (req, res)=>{
    // Deleting the data from DB
    res.send("Data has been deleted from DB Successfully");
})

app.patch("/user" , (req, res)=>{
    // Updating the data in DB
    res.send("Data has been updated in DB Successfully using patch method");
}
)

app.use("/test",(req, res) =>{
    res.send("test");
})




app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
