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
// const cors = require("cors");
// app.use(cors());
//Cookie Parser
const cookieParser = require('cookie-parser')
app.use(cookieParser());
//Using Express.JSON
app.use(express.json());
//Custom Middleware
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'https://support-drunkenbytes.vercel.app/'
  ]
  console.log("origin is",req.get('origin'))
  if(allowedOrigins.includes(req.get('origin'))){
    console.log(allowedOrigins);
    res.setHeader("Access-Control-Allow-Origin",req.get('origin'));
    res.setHeader("Access-Control-Allow-Methods","OPTIONS, GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers",'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader("Access-Control-Allow-Credentials",'true');
    req.fromWebsite=true;
    // console.log(res)
  }
  else{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","OPTIONS, GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers",'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    req.fromWebsite=false;
  }
  console.log(req.path, req.method);
  console.log(req.cookies)
  next();
});

//Routes
//User Route
const userRoutes = require("./routes/userRoute");
app.use("/api/user", userRoutes);
//Support User Route
const supportUserRoutes = require("./routes/supportUserRoute");
app.use("/api/support-user", supportUserRoutes);
//NFT Route
const nftRoutes = require("./routes/nftRoute");
app.use("/api/nft", nftRoutes)
//Transaction Routes
const transactionRoutes = require("./routes/transactionRoute");
app.use("/api/transaction", transactionRoutes)
//Api Key Routes
const apiKeyRoutes = require("./routes/apiKeyRoute");
app.use("/api/api-key", apiKeyRoutes)

app.get("/", async (req, res) => {
  res.send(`
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
