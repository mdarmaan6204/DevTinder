# DevTinder

1. Configure the file
   _npm init_ - add a json file package.json
2. Create a folder src
   Inside src folder there will be app.js
3. For creating server we use ExpressJs

- Install ExpressJs _npm i express_
- in app.js =>
  \*const express = require("express");

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
- _POSTMAN_ is use for API Testing

## HTTP Methods :-

\*<!-- This will match all the HTTP method API calls to /user -->

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
    })\*

- Routing path can be regex too..

For API call _http://localhost:3000/user?user_id=101_ || _http://localhost:3000/user?user_id=101&name=Armaan_

<!-- -> To get the query we use req.query -->
app.get("/user" , (req , res)=> {
console.log(req.query);
res.send({name:"Malik" , age:21})
});

<!-- For dynamic API routing like -->

- _http://localhost:3000/user/101_ || _http://localhost:3000/user/101/armaan/20_
- "/user/:userId" || "/user/:userId/:name/:age"
  We get user id by _req.param_
  app.get("/user/:userId" , (req , res)=> {
  console.log(req.params);
  res.send({name:"Malik" , age:21})
  });

# Middlewares and Error Handling

## Multiple route handler

- If we don't send the reponse _res.send("Hello from server")_ then it will keep sending request to the server till timeout
- We have multiple route handler for single route using next

    app.use(
    "/user",
    (req, res, next) => {
    // Saving the data to DB
    // res.send("Data has been saved to DB Successfully");
    next();
    },
    (req, res) => {
    res.send("Response from the second middleware");
    }
    );

It is same as

    app.get("/user",(req,res,next)=>{
    console.log(" 1st Router handler");
    next();
    })
    app.get("/user",(req,res,next)=>{
    console.log(" 2nd Router handler");
    })

* If we send response in the first route handler then it will not go to the next router handler if there will be next() otherwise not.
  But if we not send the response then it will go to the next route handle if next() is being called..

* If we send multiple response from multiple route handle it will through a error _Cannot set headers after they are sent to the client_

* If there are multiple route handler fn. rh1 , rh2 .. etc
  _app.use("/route" ,rh1 , rh2 , rh3, rh4,rh5)_

* We can wrap some route handler in array , all are valid
  _*app.use("/route" ,[rh1 , rh2 , rh3, rh4,rh5])*
  *app.use("/route" ,rh1 , [rh2 , rh3], rh4,rh5)*
  *app.use("/route" ,[rh1 , rh2 , rh3], rh4,rh5)*_

* Middlewares are the route handler function , all the rh fn before the rh who sends the response.

* Why do we need middlewares

      app.get("/admin/user", (req,res)=>{
      // Check for is user is admin or not
      const token = "xyz";
      if(token === "xyz")
      {
      res.send("You are admin");
      }
      else
      {
      res.status(401).send("You are not admin");
      }
      })

      app.get("/admin/delete", (req,res)=>{
      // Check for is user is admin or not
      const token = "xyz";
      if(token === "xyz")
      {
      res.send("You are admin and user is deleted");
      }
      else
      {
      res.status(401).send("You are not admin");
      }
      })

- In the above exmple we are keep writing again and again to check user is admin or not which is not good , here middlewares comes into the picture

      app.use("/admin", (req, res, next) => {
      // Check for is user is admin or not
      const token = "xyz";
      if (token !== "xyz") {
      res.status(401).send("You are not admin");
      }
      next();
      });
      app.get("/admin/user", (req, res) => {
      res.send("You are admin and get the user");
      });

      app.get("/admin/delete", (req, res) => {
      res.send("You are admin and user is deleted");
      });

- Now middlewares first check for the user is a valid admin or not then if he is valid then next() route handler will get called else error of unauthorised is send.

- Best Practice to write middlewares is create a middlewares folder in src and for each middleware fn create a file , write the fn and export it and import in the app.js

_const {adminAuth} = require("./middlewares/auth");_
_app.use("/admin", adminAuth);_

- Verifying user too..
  _const {adminAuth , userAuth} = require("./middlewares/auth");_
  _app.use("/admin", adminAuth);_
  ...
  _app.get("/user", userAuth , (req, res)=> {});_
    <!-- Above one is  middleware -->
  _app.get("user/login" , (req,res)=> {})_ Here we dont use middleware as we dont need auth

## Error Handling

- Use try and catch block and also handle at the end.. as let suppose anything breaks in the code and it is not handled by try and catch then it will handle at the end... for safer side..

        app.get("/user", (req, res, next) => {
        try{
            res.send("User");
        }
        catch
        {
            res.status(500).send("Something went wrong");
        }
        });

- We handle it at the end of all route
      app.use("/" , (err , req , res , next)=>
      {
      if(err)
      {
      <!-- Log the errors -->
      res.status(500).send("Something went wrong");
      }
      })

# Database , Schema & Models and Mongoose

- We gonna confiure our database so we create a folder inside src _config_ , inside config there will be _database.js_ file
- Install mongoose => _*npm i mongoose*_

- In _database.js_
    const mongoose = require("mongoose");
    const connectDb = async () => {
    await mongoose.connect(
    "mongodb+srv://malikgrd786:malikgrd786@namastenode.dpa3l.mongodb.net/devTinder"
    );
    };
    module.exports = connectDb;

- First we will connect to the DB then we will start listening to the server . So in app.js
        const express = require("express");
        const app = express();
        const connectDb = require("./config/database");

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

 ## Models & Schema

 - For models we create a folder inside src _models_ 
 - Inside models we are creating different files according to diffrent models , here user.js

        const mongoose = require("mongoose");
        const userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
        },
        email: {
            type: String,
        },
        gender: {
            type: String,
        },
        password: {
            type: String,
        },
        });

        const User = mongoose.model("User", userSchema);

        module.exports = User;

- First we create Schema of user then we create model from the schema and then export it        
- *Model* => It is like class where we create instance of a class i.e user , that's why name should start with capital letter.

- CREATING /signup API

        const User = require("./models/user");

        app.post("/signup" , async (req , res) => {

        // Creating a instance of User model
        const userObj = new User({
            name: "Armaan",
            age : 22, 
            email: "armaan@gmail",
            gender : "male",
            password: "armaan@123",
        });

        await userObj.save();
        res.send("User added Successfully");

        })

- Most of function in Mongoose returns a promise
- Since save() fn. return a promise we write await and make the function async..
- devTinder is Database , User is Collection , user1 is a document
- In MongoDB when we save user there is automatic _ _id : 676ba660cbedf17391d4a875_ is generated by MongoDB , but you can also do it manually 
and __v is for version of the data , how many times it get uupdated.. etc..

- It is prefered that chnage the id and __v
- We should write the database fn. in try catch block

        try {
            // Saving the user object to the database
            await userObj.save();
            res.send("User added Successfully");
        } catch (error) {
            res.send(error.message);
        }

# Diving into APIs

### Pass dynamic data into API
- TO send the dynamic object to save the data in DB we will pass via _req_ 
- In postman go to _body_ then _raw_ then _JSON_ and add the json file like
        {
            name: "malik",
            age : 22, 
            email: "malik@gmail",
            gender : "male",
            password: "malik@123",
        }
- Now to access the data in server side , _req.body_ , but it is not in json file so to convert it we have to use middleware to convert the data in json 
- Express provide middleare to convert to JSON :  
        app.use(express.json());

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

## Creating feed API (GET all the data)

Refer this website :- [Mongoose](https://mongoosejs.com/docs/queries.html)

> Fetching user with specific email
    app.get("/user" , async (req , res) => {
    const userEmail = req.body.email;
    try{
        const users = await User.find({email : userEmail});
        if(users.length === 0)
        res.status(404).send("No user found with this email");
        else
        res.send(users);
    }
    catch(error){
        res.send("Something went wrong" + error.message);
    }
    })

- To fetch all user   => const users = await User.find({el}); 
- To fetch one user   => const users = await User.findOne({email : "malik@gmail"}); 
- findOne return the any arbitary  object , find return an array which matches the conditons

## Creating delete API

<!-- / Deleting user by id -->
    app.delete("/user" , async (req , res)=> {
    const userId = req.body.userId;

    try{
        const user = await User.findByIdAndDelete(userId);
        if(user === null)
        res.status(404).send("No user found with this id");
        else
        res.send("User deleted successfully");
    }
    catch(err){
        res.send("Something went wrong" + err.message);
    }
    })

## Creating update API (Patch)    

    app.patch("/user" , async (req , res) => {
    const userId = req.body.userId;
    const data = req.body;

    try{
        const user = await User.findByIdAndUpdate({_id : userId} , data)
        res.send("User updated successfully");
    }
    catch(err){
        res.send("Something went wrong" + err.message);
    }
    });

    <!-- Here returned user is the before one -->
    const user = await User.findByIdAndUpdate({_id : userId} , data)

    <!-- To get the updated user -->
    const user = await User.findByIdAndUpdate({_id : userId} , data , {returnDocument : "after"})

    <!-- We can also but before in place of after to get before updation data , and it is by default -->
    
- If we add extra data which is not in the schema then API will ignore that data
