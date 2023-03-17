//Configuring Dotenv to use environment variables from .env file
require("dotenv").config();

//Import Modules
const path = require("path")
const logger = require("./config/logger");

//Connecting the database
const connectDB = require("./config/db");
connectDB();

//Creating express server
const express = require("express");
const app = express();

//Specifying the port
const port = process.env.PORT || 5000;

// Serving Static Folder
app.use("/v1/public/images", express.static(path.join(__dirname,"/public/images")))
app.use("/v1/logs", express.static(path.join(__dirname,"/logs")))

//
app.use(express.json({limit: '50mb'}))

// Middlewares
// Log Requests
app.use((req, res, next) => {
  const message = `${req.method} ${req.url}`;
  logger.info(message);
  next();
});

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