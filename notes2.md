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




