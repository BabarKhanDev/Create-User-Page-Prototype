const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();
const app = express();
const path = require('path');

// this allows us to receive json data from a post request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// This allows users to access all files in the public directory
app.use(express.static(path.join(__dirname, 'public')));

// add router in express app
app.use("/",router);

router.get('/',(req, res) => {
    res.sendFile(path.join(__dirname,"public/index.html"));
});

router.post('/getState', function requestHandler(req, res) {

    //the data from the post request is stored in req.body
    //it should be a json item
    console.log(req.body.lastSeen)
    let currentDate = new Date();

    //res.end is how we send data back to the client
    res.end(currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds());

});

app.listen(3000,() => {
    console.log("Started on PORT 3000");
})