//Configuring Dotenv to use environment variables from .env file
require("dotenv").config();

//Connecting the database
const connectDB = require("./config/db");
connectDB();
const path=require("path")

//Creating express server
const express = require("express");
const app = express();

//Specifying the port
const port = process.env.PORT || 5000;

// Serving Static Folder
app.use("/v1/public/images", express.static(path.join(__dirname,"/public/images")))

// Middlewares
// CORS Handler
const corsHandler = require("./middlewares/corsHandler");
app.use(corsHandler);

//Cookie Parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//Using Express.JSON
app.use(express.json());

// Origin Assigner
const originAssigner = require("./middlewares/originAssigner");
app.use(originAssigner);

//Routes
const indexRouter = require("./routes/indexRouter");
app.use("/", indexRouter);

//Redirect on 404
app.get('*', function(req, res){
  // res.status(404).send('what???');
  res.redirect('https://drunkenbytes.vercel.app/');
});

// Error Handler
const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);

//Listening om the port
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});