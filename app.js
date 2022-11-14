const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();
const app = express();
const path = require('path');

var usernames = [];
var createdUserDict = {};

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

router.post('/checkUsernameTaken', function requestHandler(req,res){

    console.log(usernames);
    console.log(req.body.username);
    console.log(usernames.includes(req.body.username));
    res.end(String(usernames.includes(req.body.username)))

})

router.post('/clearExistingUser', function requestHandler(req,res){

    usernames = usernames.filter(function(value,index,arr){return value!=req.body.username})
    createdUserDict[req.ip] = undefined;
    console.log('cleared user: ', req.username)
    res.end('user cleared')

})

router.post('/checkIfIPExist', function requestHandler(req, res){

    if(createdUserDict[req.ip] != undefined ){
        res.end(createdUserDict[req.ip][0] + '/' + createdUserDict[req.ip][1])
    }
    else{
        res.end('false')
    }

});

router.post('/postPP', function requestHandler(req, res) {

    //this is the image that the user selected
    createdUserDict[req.ip] = [req.body.username , req.body.image]  
    usernames.push(req.body.username)
    console.log(createdUserDict)

    //res.end is how we send data back to the client
    res.end('true');

});

app.listen(3000,() => {
    console.log("Started on PORT 3000");
})