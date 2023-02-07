//Configuring Dotenv to use environment variables from .env file
require("dotenv").config();

//Connecting the database
const connectDB = require("./config/db");
connectDB();

//Creating express server
const express = require("express");
const app = express();

//Specifying the port
const port = process.env.PORT || 5000;

//Middlewares
//Enabling CORS
const supportOrigin = [
  "http://localhost:3000/",
  "http://localhost:3000",
  "https://support-drunkenbytes.vercel.app/",
  "https://support-drunkenbytes.vercel.app"
];
const mainOrigin = [
  "http://localhost:3001/",
  "http://localhost:3001",
  "https://drunkenbytes.vercel.app/",
  "https://drunkenbytes.vercel.app"
];
app.use((req, res, next) => {
  const origin = req.get("origin");
  const isWhitelisted =
    supportOrigin.includes(origin) || mainOrigin.includes(origin);
  if (isWhitelisted) {
    res.setHeader("Access-Control-Allow-Origin", req.get("origin"));
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,Content-Type,Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,Content-Type,Authorization"
    );
  }
  // Pass to next layer of middleware
  if (req.method === "OPTIONS") res.sendStatus(200);
  else next();
});

//Cookie Parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());
//Using Express.JSON
app.use(express.json());

app.use((req, res, next) => {
  const origin = req.get("origin");
  if (supportOrigin.includes(origin)) {
    req.originSource = "SUPPORT";
  } else if (mainOrigin.includes(origin)) {
    req.originSource = "MAIN";
  } else {
    req.originSource = "ANOTHER"
  }
  next();
});

//Routes
const indexRouter = require("./routes/indexRouter");
app.use("/", indexRouter);

app.get("/", async (req, res) => {
  res.status(201).send(`
    <div style='width:100%; height:100%; display:flex; justify-content:center; align-items:center;'>
        <h1>Welcome to NFT based Warranty System by Drunken Bytes</h1>
    </div>
    `);
});

// Error Handler
const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);

//Listening om the port
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Export the Express API
module.exports = app;
