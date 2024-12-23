# DevTinder

1. Configure the file
    _npm init_ -> add a json file package.json
2. Create a folder src
 Inside src folder there will be app.js
 3. For creating server we use ExpressJs
 -> Install ExpressJs _npm i express_
 -> in app.js => 
        *const express = require("express");

        const app = express();

        <!-- TO send response from server (REQUEST HANDLER) -->
        <!-- It will listen to all route -->
        app.use((req, res) =>{
            res.send("hello from server");
        })

         <!-- It will listen to all route -->
        app.use("/test",(req, res) =>{
            res.send("hello from server test");
        })
        app.use("/hello",(req, res) =>{
            res.send("hello from server hello hello hello");
        })


        app.listen(3000, () => {
        console.log("Server is running on port 3000");
        });*


TO start the server after any change autmoatically install nodemon => _npm i -g nodemon_
-> g means intall it in global level...
-> to run the file => nodemon src/app.js

<!-- using npm run dev -->
1. chnage the scripts of package.json 
"scripts": {
    "start": "node src/app,js",
    "dev" : "nodemon src/app.js"
  },

npm run dev => will start the nodemon
npm run start => will start using node


# Routing and Request Handling


