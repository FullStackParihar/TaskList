const express = require("express");
const mongoose = require("mongoose");
const parser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userroutes");
const taskRoutes = require("./routes/taskroute");
const listRoutes = require("./routes/listroute");


const app = express();
app.use(cors());
const port = process.env.PORT;

app.use(express.json());

mongoose.connect('mongodb+srv://vishnu:1234@cluster0.7j48j.mongodb.net/miniproject', {

}).then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));



app.use("/user", userRoutes);
app.use("/task", taskRoutes);
app.use("/list", listRoutes);



app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});