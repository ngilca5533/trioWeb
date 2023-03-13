var express = require("express");
var app = express();
var HTTP_PORT = process.env.PORT || 8080;
require('dotenv').config();
app.use(express.static("views"));
app.use(express.static("public"));
const { engine } = require("express-handlebars")
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));




const clientSession = require("client-sessions");

app.use(clientSession({
    cookieName: "Cap805Session",
    secret: "cap805_week8_mongodbDemo",
    duration: 8 * 60 * 1000,
    activeDuration: 1000 * 60
}));


const mongoose = require("mongoose");
mongoose.connect(process.env.dbConn, { useNewUrlParser: true, useUnifiedTopology: true });
const UserModel = require("./models/userModel");



function OnHttpStart() {

    console.log("express server starts");

}


function ensureLogin(req, res, next) {
    if (!req.Cap805Session.user) {
        res.redirect("/login");
    } else {
        next();
    }
}

function ensureAdmin(req, res, next) {
    if (!req.Cap805Session.user.isAdmin) {
        res.redirect("/login");
    } else {
        next();
    }
}




app.get("/", (req, res) => {
    res.render("home", { user: req.Cap805Session.user, layout: false })
});
app.get("/about", (req, res) => {
    res.render("about", { user: req.Cap805Session.user, layout: false })
});
app.get("/contact", (req, res) => {
    res.render("contact", { user: req.Cap805Session.user, layout: false })
});
app.get("/category", (req, res) => {
    res.render("category", { user: req.Cap805Session.user, layout: false })
});

app.get("/login", (req, res) => {
    res.render("login", { user: req.Cap805Session.user, layout: false })
});

app.get("/register", (req, res) => {
    res.render("register", { user: req.Cap805Session.user, layout: false })
});

app.get("/logout", (req, res) => {
    req.Cap805Session.reset();
    res.redirect("/")
});
app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username === "" || password === "") {
        res.render("login", { layout: false });
    }

    // check username
    if (username === sampleUser4.user_name && password === sampleUser4.password) {
        req.Cap805Session.user = {
            username: sampleUser4.user_name,
            email: sampleUser4.user_email,
            isAdmin: sampleUser4.isAdmin,
            firstName: sampleUser4.user_firstName,
            lastName: sampleUser4.user_lastName
        };

        if (sampleUser4.isAdmin) {
            res.redirect("/admin/dashboard");
        } else {
            res.redirect("/dashboard");
        }
        console.log("Login was successful");
    } else {
        res.render("login", { layout: false });
    }
})

app.get("/profile", (req, res) => {
    res.render("profile", { layout: false, user: req.Cap805Session.user });
});

app.get("/dashboard", ensureLogin, (req, res) => {
    res.render("dashboard", { user: req.Cap805Session.user, layout: false })
});






app.listen(HTTP_PORT, OnHttpStart)




// require mongoose and setup the Schema
var Schema = mongoose.Schema;

// connect to Your MongoDB Atlas Database
mongoose.connect("mongodb+srv://dbUser:Kishkinova10@trioweb.avo35t0.mongodb.net/?retryWrites=true&w=majority");


var commentSchema = new Schema({
    "comment": String,
    "user_name": String,
    "date": Date,
});

commentSchema.add({ "replies": [commentSchema] });

//var comment = mongoose.model("trio_comments", commentSchema);

var postSchema = new Schema({
    "user_name": String,
    "category_name": String,
    "comments": [commentSchema],
    "title": String,
    "description": String
});
var post = mongoose.model("trio_posts", postSchema);

var userSchema = new Schema({
    "user_name": {
        "type": String,
        "unique": true
    },
    "user_email": String,
    "user_firstName": String,
    "user_lastName": String,
    "password": String,
    "isAdmin": {
        "type": Boolean,
        "default": false
    }

})

var user = mongoose.model("trio_users", userSchema)

var sampleUser4 = new user({
    user_name: "NickGAdmin",
    user_email: "some@email.com",
    user_firstName: "Nick",
    user_lastName: "Gilca",
    password: "12345",
})


var newDate = new Date();
newDate = newDate.toString();
var sampleComment = {
    comment: "this is a comment",
    user_name: "NickGAdmin",
    date: newDate,
}



var samplePost = new post({
    user_name: "NickGAdmin",
    category_name: "IT",
    comments: [sampleComment],
    title: "Some Title",
    description: "Some description"

})

sampleUser4.save().then(() => {
    console.log("User successfully added");
    user.find({ user_name: "NickGAdmin" })
        .exec()
        .then((user) => {
            if (!user) {
                console.log("No user found");
            } else {
                console.log(user);
                res.redirect("/");
            }
        })
        .catch((err) => {
            console.log(`There was an error: ${err}`);
        });
}).catch(err => {
    console.log(`There was an error saving the user: ${err}`);
});

samplePost.save().then(() => {
    console.log("Post successfully added");
    post.find({ user_name: "NickGAdmin" })
        .exec()
        .then((post) => {
            if (!post) {
                console.log("No post found");
            } else {
                console.log(post);
            }
        })
        .catch((err) => {
            console.log(`There was an error: ${err}`);
        });
}).catch(err => {
    console.log(`There was an error saving the post: ${err}`);
});
  //