const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);

// Here I have defined a Mongoose schema for a User model with fields for username, email, and password.
//  The email field is set to be unique to prevent duplicate registrations. Finally, the model is exported for use in other parts of the application.
