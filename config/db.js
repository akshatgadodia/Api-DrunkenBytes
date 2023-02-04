const mongoose = require('mongoose');

const cluster = process.env.DB_CLUSTER;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const connectionUrl = `mongodb+srv://${username}:${password}@${cluster}.gvryb6a.mongodb.net/?retryWrites=true&w=majority`

const connectDB = async () => {
    try {
        await mongoose.set("strictQuery", false);
        await mongoose.connect(connectionUrl)
        console.log("Connection to MongoDB database successful")
    } catch (error) {
        console.log("Connection to MongoDB database failed")
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB