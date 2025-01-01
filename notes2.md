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
* GET /user/request
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
            app.listen(3000, () => {
            console.log("Server is running on port 3000");
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
