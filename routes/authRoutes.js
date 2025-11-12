// import the necessary modules

// importing express, jsonwebtoken, bcrypt, and the User model
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

// importing router from express so that we can define routes

const router = express.Router();

// Middleware to protect routes
function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // verified contains { userId: ... }
    next();
  } catch (err) {
    res.redirect("/login");
  }
}

// Profile Route (Protected Route) : Here we will create a middleware to check if the user is authenticated or not
router.get("/profile", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");
  if (!user) return res.redirect("/login");
  res.render("profile", { user });
});

// Home Page Route
router.get("/", (req, res) => {
  res.render("home"); // rendering home.ejs file
});

// Signup Form
router.get("/signup", (req, res) => {
  res.render("signup"); // rendering signup.ejs file
});

// Signup POST Route
router.post("/signup", async (req, res) => {
  // Here we have destructured the username, email and password from req.body
  const { username, email, password } = req.body;

  // Now we will hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  // Now we will create a new user using the User model
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  // Now we will save the user to the database
  await newUser.save(); // this will save the user to the database because of mongoose

  // Now we will redirect the user to the login page after successful signup
  res.redirect("/login");
});

// Login Form
router.get("/login", (req, res) => {
  res.render("login"); // rendering login.ejs file
});

// Login POST Route

router.post("/login", async (req, res) => {
  // Destructuring email and password from req.body
  const { email, password } = req.body;

  // Finding the user in the database using the email
  const user = await User.findOne({ email });

  // If user not found, send error response
  if (!user) {
    return res.status(400).send("User not found");
  }

  // Comparing the provided password with the hashed password in the database
  const isMatch = await bcrypt.compare(password, user.password);

  // If password does not match, send error response
  if (!isMatch) return res.send("Invalid password");

  // Now we will create a JWT token for the user so that we can authenticate the user in future requests

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  }); // this will expire in 1 hour

  // Now we will set the token in the cookies
  res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });

  // Now we will redirect the user to the profile page after successful login
  res.redirect("/profile");
});


// Logout Route
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

module.exports = router;
