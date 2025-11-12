require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // they will parse cookies from incoming requests
app.use(express.static(path.join(__dirname, "public")));

// EJS setup

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Syntax : app.set(view_option, path)

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ Mongo Error:", err));

// Routes

app.use("/", authRoutes); //  Iaks matlab haih ke jab bhi koi "/" route pe request karega to wo authRoutes wale file me jayega and waha se handle hoga


// Start server
app.listen(process.env.PORT || 3000, () =>
  console.log("🚀 Server running at http://localhost:3000")
);
