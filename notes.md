# DevTinder

1. Configure the file
    _npm init_ - add a json file package.json
2. Create a folder src
 Inside src folder there will be app.js
 3. For creating server we use ExpressJs
 - Install ExpressJs _npm i express_
 - in app.js => 
        *const express = require("express");

        const app = express();

        <!-- TO send response from server (REQUEST HANDLER) -->
       

         <!-- It will listen to all route -->
        app.use("/test",(req, res) =>{
            res.send("hello from server test");
        })
        app.use("/hello",(req, res) =>{
            res.send("hello from server hello hello hello");
        })

         <!-- It will listen to all route so it should use at the end  if not then this will override all route  -->
        app.use("/",(req, res) =>{
            res.send("hello from server");
        })

        <!-- request handle is like wildcard and sequence matters like if else if and else  -->
        <!-- /xyz matches with /xyz/2 , /xyz/fgld , /xyz/jfnusu/fknsu but not with /xyz2 -->


        app.listen(3000, () => {
        console.log("Server is running on port 3000");
        });*


TO start the server after any change autmoatically install nodemon => _npm i -g nodemon_
- g means intall it in global level...
- to run the file => nodemon src/app.js

<!-- using npm run dev -->
1. chnage the scripts of package.json 
"scripts": {
    "start": "node src/app,js",
    "dev" : "nodemon src/app.js"
  },

npm run dev => will start the nodemon
npm run start => will start using node



# Routing and Request Handling

- Order of routes matters.
- *POSTMAN* is use for API Testing

## HTTP Methods :-

<!-- This will match all the HTTP method API calls to /user -->
app.use("/test" , (req,res)=> {});

<!-- This will match only the GET method API call to /user -->
app.get("/test" , (req,res)=> {});

app.get("/user" , (req , res)=> {
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


app.use("/test",(req, res) =>{
    res.send("test");
})


- Routing path can be regex too..

For API call _http://localhost:3000/user?user_id=101_ || _http://localhost:3000/user?user_id=101&name=Armaan_

-> To get the query we use req.query
app.get("/user" , (req , res)=> {
    console.log(req.query);
    res.send({name:"Malik" , age:21})
}); 

For dynamic API routing like
- _http://localhost:3000/user/101_   || _http://localhost:3000/user/101/armaan/20_
-  "/user/:userId" || "/user/:userId/:name/:age"
We get user id by *req.param*
app.get("/user/:userId" , (req , res)=> {
    console.log(req.params);
    res.send({name:"Malik" , age:21})
});

