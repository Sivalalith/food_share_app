// require the modules into the project
const express = require("express");
const http = require('http');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const cookieParser = require("cookie-parser");

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public", { index: 'login.html' }));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// Create an HTTP server using Express
const server = http.createServer(app);

// All the posts are stored
const posts = [];

// Routes handling
app.get("/signup", function(req,res){
    res.sendFile(__dirname + "/public/signup.html");
})

app.get("/login", function(req,res){
    res.sendFile(__dirname + "/public/login.html");
})

app.get("/home", function(req,res){
    const userName = req.cookies["userName"];
    console.log("GET call made to /home");
    res.render("home",{
        userName: userName
    })
})

app.post("/home", function(req,res){
    const userName = req.body.userName;
    res.cookie("userName",userName,{maxAge: 900000, httpOnly: true});
    res.render("home",{
        userName: userName
    })
})

app.get("/food/donate", function(req,res){
    const userName = req.cookies["userName"];
    res.render("donate-food", {
        userName: userName
    });
})

app.post("/food/donate", function(req,res){
    const title = req.body.postTitle;
    const user = req.body.postUser;
    const foodDonationLocation = req.body.foodDonationLocation;
    const foodDetails = req.body.foodDetails;
    const additionalNotes =req.body.additionalNotes;

    const post = {
        title: title,
        user: user,
        foodDonationLocation: foodDonationLocation,
        foodDetails: foodDetails,
        additionalNotes: additionalNotes
    }

    posts.push(post);

    res.render("donate-food", {
        userName: post.user
    });
})

app.get("/food/myposts", function(req,res){
    res.render("my-posts",{
        posts: posts
    });
})

app.get("/food/receive", function(req,res){
    const userName = req.cookies["userName"];
    res.render("receive-food", {
        userName: userName,
        posts: []
    });
})

app.post("/food/receive", function(req,res){
    console.log("Req body: ",req.body);
    const userName = req.cookies["userName"];
    const chosenLocation = req.body.foodNotificationLocation;
    //console.log("Total posts:",posts);
    const postsFromChosenLocation = getPostsFromLocation(chosenLocation);
    console.log("Posts from chosen location:",postsFromChosenLocation,"\n");
    // res.send(postsFromChosenLocation);
    res.render("receive-food", {
        userName: userName,
        posts: postsFromChosenLocation
    })
})

function getPostsFromLocation(chosenLocation) {
    return posts.filter((post)=> post.foodDonationLocation === chosenLocation);
}

server.listen(3000, function(req,res){
    console.log("Server has started listening on port 3000.");
});

