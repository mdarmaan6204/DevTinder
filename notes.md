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

- TO send response from server (REQUEST HANDL


- It will listen to all ro
       app.use("/test",(req, res) =>{
           res.send("hello from server test");
       })
       app.use("/hello",(req, res) =>{
           res.send("hello from server hello hello hello");
       })

- It will listen to all route so it should use at the end  if not then this will override all rou
       app.use("/",(req, res) =>{
           res.send("hello from server");
       })

- request handle is like wildcard and sequence matters like if else if and el
- /xyz matches with /xyz/2 , /xyz/fgld , /xyz/jfnusu/fknsu but not with /x


       app.listen(3000, () => {
       console.log("Server is running on port 3000");
       });*

TO start the server after any change autmoatically install nodemon => _npm i -g nodemon_

- g means intall it in global level...
- to run the file => nodemon src/app.js

- using npm run 

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

- This will match all the HTTP method API calls to /u

    app.use("/test" , (req,res)=> {});

- This will match only the GET method API call to /u

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

- To get the query we use req.qu
    app.get("/user" , (req , res)=> {
    console.log(req.query);
    res.send({name:"Malik" , age:21})
    });

- For dynamic API routing l

- _http://localhost:3000/user/101_ || _http://localhost:3000/user/101/armaan/20_
- "/user/:userId" || "/user/:userId/:name/:age"
>  We get user id by _req.param_
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

- It is same

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

 const { adminAuth } = require("./middlewares/auth");
app.use("/admin", adminAuth);

    // - Verifying user too..
    const { adminAuth, userAuth } = require("./middlewares/auth");
    app.use("/admin", adminAuth);
    app.get("/user", userAuth, (req, res) => {});
// - Above one is  middlew
    app.get("user/login", (req, res) => {});
// - Here we dont use middleware as we dont need a

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
- Log the err
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

- Fetching user with specific email
    app.get("/user", async (req, res) => {
    const userEmail = req.body.email;
    try {
        const users = await User.find({ email: userEmail });
        if (users.length === 0)
        res.status(404).send("No user found with this email");
        else res.send(users);
    } catch (error) {
        res.send("Something went wrong" + error.message);
    }
    });


- To fetch all user   => const users = await User.find({el}); 
- To fetch one user   => const users = await User.findOne({email : "malik@gmail"}); 
- findOne return the any arbitary  object , find return an array which matches the conditons

## Creating delete API

- / Deleting user by
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

- Here returned user is the before 
    const user = await User.findByIdAndUpdate({_id : userId} , data)

- To get the updated u
    const user = await User.findByIdAndUpdate({_id : userId} , data , {returnDocument : "after"})

- We can also but before in place of after to get before updation data , and it is by defa
    
- If we add extra data which is not in the schema then API will ignore that data


# Data Sanitization & Schema Validation

[Mongoose Schema Type](https://mongoosejs.com/docs/schematypes.html)

> Some checks are :- 

- **required** -> It means this field is mandatory to add new data in the MongoDB.
- **unique** -> It means this field must be unique in the database.
- **default** -> If this field is not entered then default value is assigned to the field.
- **lowercase** -> It means this field store the data in after converting the field in lowercase.
- **trim** -> This will remove the extra white spaces.
- **minLength** -> This field must have minLength of that specific value.(For type:String)
- **maxLength** -> This field must have maxLength of that specific value.
- **min** -> This field must have min value of that specific value. (For type : Number)
- **max** -> This field must have max value of that specific value. (For type : Number)

- **validate** -> It is use to create custom validate fn. By default this validator works only for the new user created , to enable for existing user you have to add _options_ in the _app.patch_ runValidators : true like this 

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
        returnDocument: "after",
        runValidators: true,
    });

- For **timestamp** there are two ways
- Method 1 :  This will store the createdAt , updatedAt value...
    const userSchema = new Schema({ name: String }, { timestamps: true });

[Mongoose Timestamp Document ](https://mongoosejs.com/docs/timestamps.html)

- Method 2:  By adding data in Schema
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },


- Method 1 is easy to use and MongoDB will handle that so we are using M1;

#### Final Schema : 
const mongoose = require("mongoose");

    const userSchema = new mongoose.Schema(
    {
        fname: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
        },
        lname: {
        type: String,
        },
        age: {
        type: Number,
        min: 18,
        },
        email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        },
        gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
            throw new Error("Gender is not valid");
            }
        },
        },
        password: {
        type: String,
        },
        photoUrl: {
        type: String,
        default:
            "https://www.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_134151661.htm",
        },
        skills: {
        type: [String],
        },
        about: {
        type: String,
        default: "Hey there I am using this app",
        },
    },
    { timestamps: true }
    );

    const userModel = mongoose.model("User", userSchema);

    module.exports = userModel;

## More on validations (API level validation):

- We should not allow to send irrelevant data , allow only some filed to update...
- Never trust user , any attacker can send vunerable data so try to add validation and API should be 100% safe.

        ```app.patch("/user/:userId", async (req, res) => {
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
        if(data.skills.length > 10)
        {
        throw new Error("SKills should not be more than 10");
        }

        const user = await User.findByIdAndUpdate({ _id: userId }, data, {
        returnDocument: "after",
        runValidators: true,
        });
        console.log(user);
        res.send("User updated successfully");
        } 
        catch (err)
        {
            res.send("Something went wrong" + err.message);
        }
        });

### Validating using library
- Validating an email is tough job , but there is a library know as _validator_ which is use for validating complex thing easyily ( **NEVER TRUST req.body** )
- First install it _npm i validator_

[Validator Github Repo](https://github.com/validatorjs/validator.js)
- **SCHEMA LEVEL VALIDATION**

- Validator should be used in the end of field


        ```const validator = require("validator");
        email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
            throw new Error("Email is not valid");
            }
        },
        },

        photoUrl: {
        type: String,
        default:
            "https://www.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_134151661.htm",
        validate(value) {
            if (!validator.isURL(value)) {
            throw new Error(" Invalid Photo URL");
            }
        },
        },

        password: {
        type: String,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
            throw new Error("Enter a strong Password");
            }
        },
        },


# Encrypting Password

1. Validating the data
    - For any data from (req.body) , we apply some validation. And for that validation we create some helper fn. in a different folder (Scalable) inside the _src_ , _utils_ , 
    there will be _validation.js_ where all the validation fn. are written.
>

        const validator = require("validator");
        const signUpValidation = (req) => {
        const { fname, lname, email, password } = req.body;
        if (!fname || !lname) {
            throw new Error("Enter a valid name");
        } else if (!validator.isEmail(email)) {
            throw new Error("Enter a valid email");
        } else if (!validator.isStrongPassword(password)) {
            throw new Error("Enter a strong password");
        }
        };
        module.exports = { signUpValidation };




2. Encypting the data
    - For encryption we will use _Bcrypt_ package => _npm i bcrypt_
    - [Bcrypt](https://www.npmjs.com/package/bcrypt)

        bcrypt.hash(myPlaintextPassword, saltRounds).then(function(hash) {
            // Store hash in your password DB.
        });

    - Once the password is encypted then we can't decrypt it.
    >
        const bcrypt = require("bcrypt");
        app.post("/signup", async (req, res) => {
        try {
            // Validate the data
            signUpValidation(req);
            const { fname, lname, email, password } = req.body;

            // Encypt the data
            const hashPassword = await bcrypt.hash(password, 10);

            const userObj = new User({
            fname,
            lname,
            email,
            password: hashPassword,
            });

            // Saving the user object to the database
            await userObj.save();
            res.send("User added Successfully");
        } catch (err) {
            res.send(err.message);
        }
        });

## Login API 

        app.post("/login", async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
            throw new Error("Enter valid email and password");
            }

            const user = await User.findOne({ email: email });

            if (!user) {
            throw new Error("User not found");
            }
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
            throw new Error("Invalid password");
            } else {
            res.send("User logged in successfully");
            }
        } catch (err) {
            res.status(400).send("ERROR : " + err.message);
        }
        });

# Authentication , JWT  & Cookies

- When we login in a website (ex- fb.com) then a request is send to the server to validate the user with email and password.
- 2. If the password and mail is correct then
- 3. Server will generate a web token know as JWT (JSOn Web Token) and send to the clinet as cookies.
- 4. From now for every request made by the user , the request is attachd along with the cookie 
- 5. Server will validate each time the JWT token if it is correct then it will proceed futher.
- 6. And if the JWT token is expired/old then it will send a failed response.
> **JWT** token is unique for every user.

### Creating JWT token

[Express JS res.cookie](https://expressjs.com/en/5x/api.html#res.cookie)

    res.cookie(name, value [, options])


**Read the cookie that we send**
- We have to us a middleware to read the cookie [cookie-parser](https://www.npmjs.com/package/cookie-parser) _npm i cookie-parser_
- When using cookie-parser middleware, this property is an object that contains cookies sent by the request. If the request contains no cookies, it defaults to {}.
- If we dont add middleware it will return undefined.
    _const cookie = req.cookies_

## JWT
- [JWT Website](https://jwt.io/)
- There are secret message in the token , and there are three parts of a JWT token
1. **HEADER:** ALGORITHM & TOKEN TYPE 
2. **PAYLOAD**: DATA
3. **VERIFY SIGNATURE**   
- Read the doc for more information....

- For generating the JWT token we use [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) , to install it _npm i jsonwebtoken_



    const cookieParser = require("cookie-parser");
    const jwt = require("jsonwebtoken");
    app.use(express.json());
    app.use(cookieParser());
    app.post("/login", async (req, res) => {
    try 
    {
        const { email, password } = req.body;

        if (!email || !password) {
        throw new Error("Enter valid email and password");
        }

        const user = await User.findOne({ email: email });

        if (!user) {
        throw new Error("User not found");
        }
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
        throw new Error("Invalid password");
        } else {
        // Generating a JWT token
        const token = jwt.sign({ _id: user._id }, "dev@tinder123");
        console.log(token);
        // Adding the token to the cookie
        res.cookie("token", token);

        res.send("User logged in successfully");
        }
    } 
    catch (err) 
    {
        res.status(400).send("ERROR : " + err.message);
    }
    });

**/profile API**

    app.get("/profile", async (req, res) => {
    // Validate the JWT token
    try 
    {
        const { token } = req.cookies;
        if (!token) {
        throw new Error("Invalid token");
        }
        const decodedMessage = await jwt.verify(token, "dev@tinder123");
        const { _id } = decodedMessage;
        const user = await User.findById(_id);
        if (!user) {
        throw new Error("User not found");
        }
        res.send(user);
    } 
    catch (err) 
    {
        res.status(400).send("ERROR : " + err.message);
    }
    });


### auth Middleware
- As we know all the API require validation of the token except the _/signup and /login_ API , for this we will create a middleware _auth_ to validate the user and then call the next request handler.
- Like sending connections , likes , etc need to validate the user.. so in the _middleware_ folder , in _auth.js_

        const jwt = require("jsonwebtoken");
        const User = require("../models/user");
        const userAuth = async (req, res, next) => {
        try {
            const { token } = req.cookies;
            if (!token) {
            throw new Error("Token is invalid!!!!");
            }

            const decodedObj = await jwt.verify(token, "dev@tinder123");
            const { _id } = decodedObj;

            const user = await User.findById(_id);

            if (!user) {
            throw new Erorr("User not exists.");
            }
            req.user = user;
            next();
        } catch (err) {
            res.status(400).send("Error : " + err);
        }
        };

        module.exports = { userAuth };

- And in app.js for the API where userauth requires 


        const { userAuth } = require("./middlewares/auth");
        app.get("/profile", userAuth, async (req, res) => {
        try {
            
            const user = req.user;
            if (!user) {
            throw new Error("User not found");
            }
            res.send(user);
        } catch (err) {
            res.status(400).send("ERROR : " + err.message);
        }
        });

### Expire the cookie and JWT

- For JWT token expire 
    const token = jwt.sign({ _id: user._id }, "dev@tinder123" , {expiresIn : "1h"});

- For expiring the [cookie](https://expressjs.com/en/5x/api.html#res.cookie) 
    res.cookie("token", token, { expires: new Date(Date.now() + 900000) });

