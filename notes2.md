# Diving into API and express Router

## List of DevTinder APIs

**authRouther** (it is related to auth)
* POST /signup
* POST /login
* POST /logout

**profileRouther** (it is related to profile)
* GET /profile/view
* GET /profile/edit
* GET /profile/password

> **Status** :- ignored , interested , accepted , rejected

**connectionRequestRouther** (it is related to request)
* POST /request/send/interested/:userID
* POST /request/send/ignored/:userID
* POST /request/review/accepted/:userID
* POST /request/review/rejected/:userID

**userRouther** (it is related to user)
* GET /user/connections
* GET /user/request/received
* GET /user/feed -: gets others profile in platform


- For a large application there can be more than 100+ APIs and we can write all the APIs in a single file app.js. It will work fine.
- But we should use express Router and group APIs according to their function and manage seprate files for each router.

## Express Router 
- [Express Router Documentation](https://expressjs.com/en/5x/api.html#router)
- We will create a folder __routes__ in src folder and auth.js, profile.js , request.js , user.js in routes folder.
- Express Router will work exactly same as _app_ in express

    const express = require("express");
    const app = express();
    app.use("/", (req, res) => {
    // Logic
    });

    const authRouter = express.Router();
    authRouter.use("/", (req, res) => {
    // Logic
    });

- The __auth.js__ will look like


        const express = require("express");
        const { signUpValidation } = require("../utils/validations");
        const User = require("../models/user");
        const bcrypt = require("bcrypt");
        const jwt = require("jsonwebtoken");

        const authRouter = express.Router();

        authRouter.post("/signup", async (req, res) => {
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

        authRouter.post("/login", async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
            throw new Error("Enter valid email and password");
            }

            const user = await User.findOne({ email: email });

            if (!user) {
            throw new Error("User not found");
            }
            const isValidPassword = await user.validatePassword(password);

            if (!isValidPassword) {
            throw new Error("Invalid password");
            } else {
            // Generating a JWT token
            const token = await user.getJWT();
            // Adding the token to the cookie
            res.cookie("token", token, { expires: new Date(Date.now() + 900000) });

            res.send("User logged in successfully");
            }
        } catch (err) {
            res.status(400).send("ERROR : " + err.message);
        }
        });

        authRouter.post("/logout", async (req, res) => {
        res.cookie("token", null, { expires: new Date(Date.now()) });
        res.send("Logout Successfully");
        });
        module.exports = authRouter;


- Similarly all other routes and app.js will be more clean

        const express = require("express");
        const connectDb = require("./config/database");
        const cookieParser = require("cookie-parser");

        const app = express();

        app.use(express.json());
        app.use(cookieParser());
        const authRouter = require("./routes/auth");
        const profileRouter = require("./routes/profile");
        const requestRouter = require("./routes/request");
        const userRouter = require("./routes/user");

        app.use("/" , authRouter);
        app.use("/" , profileRouter);
        app.use("/" , requestRouter);
        app.use("/" , userRouter);


        connectDb()
        .then(() => {
            console.log("Database connected successfully");
            app.listen(7777, () => {
            console.log("Server is running on port 7777");
            });
        })
        .catch((err) => {
            console.error("Error connecting to database", err);
        });

- profile.js will look like

        const express = require("express");
        const User = require("../models/user");
        const { userAuth } = require("../middlewares/auth");
        const { validateProfileEdit } = require("../utils/validations");
        const bcrypt = require("bcrypt");

        const profileRouter = express.Router();

        profileRouter.get("/profile/view", userAuth, async (req, res) => {
        try {
            const user = req.user;
            if (!user) {
            throw new Error("User not found ");
            }
            res.send(user);
        } catch (err) {
            res.status(400).send("ERROR : " + err.message);
        }
        });

        profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
        try {
            const isValidEdit = validateProfileEdit(req);

            if (!isValidEdit) {
            throw new Error("Invalid Field Edit");
            }

            const loggedInUser = req.user;
            Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
            await loggedInUser.save();
            res.json({
            message: `${loggedInUser.fname} , your profile is updated Successfully`,
            data: loggedInUser,
            });
        } catch (err) {
            res.status(400).send("ERROR : " + err);
        }
        });

        profileRouter.patch("/profile/password", userAuth, async (req, res) => {
        try {
            const loggedInUser = req.user;
            const newPasswordHash = await bcrypt.hash(req.body?.password, 10);
            loggedInUser.password = newPasswordHash;
            loggedInUser.save();
            res.send("Password Updated successfully");
        } catch (err) {
            res.status(400).send("ERROR : " + err);
        }
        });

        module.exports = profileRouter;

# Logical DB Query & Compound Indexes

- We can also create check like Schema Method before saving the data in MongoDB know as [Mongoose middleware pre](https://mongoosejs.com/docs/middleware.html#pre)
- We are using this middleware in connectionRequest Model.
- It can be done in API level also.

        connectionRequestSchema.pre("save", function () {
        const connectionRequest = this;
        if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
            throw new Error("You can't send request to yourself");
        }
        });
        const ConnectionRequestModel = mongoose.model(
        "ConnectionRequest",
        connectionRequestSchema
        );

### MongoDB Indexing
- We can do indexing of the DB by using __unique as true__ or __index as true__ for that field on which based indexing will be created.
- Since our email is unique so mongoDb will automatically indexing on the email.

### Compound Indexing
- Indexing on the basisi of multiple fields like we are checking for duplicate connection we can index on the basis of __fromUserId and toUserId__
- This will speed up the MongoDB query for __existingConnection__ check.


        connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });


- Let suppose we have to query user on the basis of their full name then it is prefer to create compound index as

        connectionRequestSchema.index({ fname: 1, lname: 1 });

- Final __connectionRequest.js__

        const mongoose = require("mongoose");
        const connectionRequestSchema = new mongoose.Schema(
        {
            fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            },

            toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            },
            status: {
            type: String,
            required: true,
            enum: {
                values: ["ignored", "accepted", "interested", "rejected"],
                message: `{VALUE} is not valid status.`,
            },
            },
        },
        {
            timestamps: true,
        }
        );

        connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

        connectionRequestSchema.pre("save", function () {
        const connectionRequest = this;
        if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
            throw new Error("You can't send request to yourself");
        }
        });
        const ConnectionRequestModel = mongoose.model(
        "ConnectionRequest",
        connectionRequestSchema
        );

        module.exports = ConnectionRequestModel;

- Final __request.js__

        const express = require("express");
        const ConnectionRequest = require("../models/connectionRequest");
        const { userAuth } = require("../middlewares/auth");
        const User = require("../models/user");
        const requestRouter = express.Router();

        requestRouter.post(
        "/request/send/:status/:toUserId",
        userAuth,
        async (req, res) => {
            try {
            const fromUserId = req.user?._id;
            const toUserId = req.params?.toUserId;
            const status = req.params?.status;

            const allowedStatus = ["interested", "ignored"];

            if (!allowedStatus.includes(status)) {
                return res
                .status(400)
                .json({ message: "Invalid status type " + status });
            }

            const toUser = await User.findById(toUserId);
            if (!toUser) {
                return res.status(400).json({ message: "User not found!! " });
            }

            const existingConnection = await ConnectionRequest.findOne({
                $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
                ],
            });

            if (existingConnection) {
                return res.status(400).json({ message: "Connection already exists." });
            }

            const connectionRequest = new ConnectionRequest({
                fromUserId,
                toUserId,
                status,
            });

            const data = await connectionRequest.save();

            res.json({
                message:
                req.user.fname +
                " send a " +
                status +
                " connection to " +
                toUser.fname,
                data: data,
            });
            } catch (err) {
            res.status(400).send("ERROR : " + err);
            }
        }
        );

        requestRouter.post(
        "/request/review/:status/:requestId",
        userAuth,
        async (req, res) => {
            try {
            const loggedInUser = req.user;
            const { status, requestId } = req.params;

            // Validate the status
            const allowedStatus = ["accepted", "rejected"];
            if (!allowedStatus.includes(status)) {
                return res.status(400).send("Connection status is invalid.");
            }

            const connectionRequest = await ConnectionRequest.findOne({
                fromUserId: requestId,
                toUserId: loggedInUser._id,
                status: "interested",
            });

            if (!connectionRequest) {
                return res.status(400).send("No connection found");
            }

            connectionRequest.status = status;
            const data = await connectionRequest.save();
            res.json({ message: "Connection request " + status, data });
            } catch (err) {
            res.status(400).send("ERROR!! : " + err);
            }
        }
        );

        module.exports = requestRouter;

### User Router APIs

## Ref & Populate
- It is like the __JOIN__ in SQL.
- In __user.js__ we first get the all id of the connection recieved but we need all the details of that user not only the _id , it is not good way to store the id then find each one by one
- We will create a __refrence__ and populate (extract) the required filed.
- [ref & populate documentation](https://mongoosejs.com/docs/populate.html)
- to create a ref we just write the ref : "Schema to which we want to create refreance"

        fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        },

        toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        },

- And then populate the things need after getting the id , below both are corrrect way either array or string.

        const connectionReceived = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested",
            }).populate("fromUserId", ["fname", "lname", "age", "gender"]);
            }).populate("fromUserId", "fname lname  age, gender ");

- Final **/user/request/received** (which connection user received) look like

        userRouter.get("/user/request/received", userAuth, async (req, res) => {
        try {
            const loggedInUser = req.user;
            const connectionReceived = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested",
            }).populate("fromUserId", "fname lname  age, gender ");

            res.json({
            message: "Connection fetch Successfully!",
            data: connectionReceived,
            });
        } catch (err) {
            res.status(400).send("ERROR : " + err);
        }
        });

- Final **/user/connection** API look like 

        userRouter.get("/user/connection", userAuth, async (req, res) => {
        try {
            const loggedInUser = req.user;
            const SAFE_USER_DATA = "fname lname  age gender about skills";
            const connections = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" },
            ],
            })
            .populate("fromUserId", SAFE_USER_DATA)
            .populate("toUserId", SAFE_USER_DATA);

            const data = connections.map((row) => {
            if (loggedInUser._id.equals(row.fromUserId._id)) return row.toUserId;
            else return row.fromUserId;
            });

            res.json({ message: "Connection Fetch sucessfully", data });
        } catch (err) {
            res.status(400).send({ message: "ERROR : " + err });
        }
        });

## Pagination
- If we have more data but we should fetch only some of data one after other like paginaton
- For pagination we should use **request query** like **/feed?page=1&limit=10**

* Route                        Users    MongoDB 
* **/feed?page=1&limit=10** => 1-10 -> .skip(0) & .limit(10)
* **/feed?page=2&limit=10** => 11-20 -> .skip(10) & .limit(10)
* **/feed?page=3&limit=10** => 21-30 -> .skip(20) & .limit(10)


- Final **/user/feed** API


        userRouter.get("/feed", userAuth, async (req, res) => {
        try {
            const loggedInUser = req.user;
            const page = parseInt(req.query.page) || 1;
            let limit = parseInt(req.query.limit) || 10;
            limit = limit > 50 ? 50 : limit;
            const skip = (page - 1) * limit;

            const connectionRequest = await ConnectionRequestModel.find({
            $or: [
                {
                fromUserId: loggedInUser._id,
                },
                {
                toUserId: loggedInUser._id,
                },
            ],
            }).select("fromUserId toUserId");
            const hideUserFromFeed = new Set();

            hideUserFromFeed.add(loggedInUser._id.toString());

            connectionRequest.forEach((conn) => {
            hideUserFromFeed.add(conn.fromUserId.toString());
            hideUserFromFeed.add(conn.toUserId.toString());
            });

            const feedUsers = await User.find({
            _id: { $nin: Array.from(hideUserFromFeed) },
            })
            .select(SAFE_USER_DATA)
            .skip(skip)
            .limit(limit);

            res.json({ message: "Feed is ready ", feedUsers });
        } catch (err) {
            res.status(400).send({ message: "ERROR : " + err });
        }
        });

# App UI        