const express = require("express");
const bodyParser = require("body-parser");
const route = require("./routes/route.js");
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const app = express();

app.use(bodyParser.json());


mongoose.connect("mongodb+srv://Subhajitb17:OgCxMXjePS5uF7pR@cluster0.4toqz.mongodb.net/biswajit-db", {
    useNewUrlParser: true,
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err));

app.use("/", route);

app.listen(3000, function () {
    console.log("Express app running on port " + 3000);
});