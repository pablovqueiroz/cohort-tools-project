const router = require("express").Router();
const UserModel = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middlewares/jwt.middleware");
require("dotenv").config();

//POST /auth/signup - Creates a new user in the database
router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      res.status(400).json({ message: "Provide email, password and name" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Provide a valid email address." });
      return;
    }

    // const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    // if (!passwordRegex.test(password)) {
    //   res.status(400).json({
    //     message:
    //       "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    //   });
    //   return;
    // }

    const userAlreadyInDb = await UserModel.findOne({ email });
    if (userAlreadyInDb) {
      res.status(403).json({ errorMessage: "Invalid Credentials" });
      return;
    }
    const theSalt = bcryptjs.genSaltSync(12);
    const theHashedPassword = bcryptjs.hashSync(password, theSalt);
    const hashedUser = {
      ...req.body,
      password: theHashedPassword,
    };
    const createdUser = await UserModel.create(hashedUser);
    const safeUser = await UserModel.findById(createdUser._id).select(
      "-password"
    );
    res.status(201).json(safeUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: "Internal server error" });
  }
});

//POST /auth/login - Checks the sent email and password and, if email and password are correct returns a JWT

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userAlreadyInDb = await UserModel.findOne({ email });
    if (!userAlreadyInDb) {
      return res.status(401).json({ errorMessage: "Invalid Credentials" });
    }
    const doesThePasswordMatch = bcryptjs.compareSync(
      password,
      userAlreadyInDb.password
    );
    if (!doesThePasswordMatch) {
      return res.status(401).json({ errorMessage: "Invalid Credentials" });
    }
    const payload = { _id: userAlreadyInDb._id };
    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    res
      .status(200)
      .json({ message: "you are now logged in, nice work", authToken });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: "Internal server error" });
  }
});

//GET /api/users/:id - Retrieves a specific user by id.
// The route should be protected by the authentication middleware.

router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.payload._id !== id) {
      return res.status(403).json({ errorMessage: "Access denied!" });
    }
    const foundOneUser = await UserModel.findById(id).select("-password");
    if (!foundOneUser) {
      return res.status(404).json({ errorMessage: "User not found." });
    }
    console.log("user found: ", foundOneUser);
    res.status(200).json(foundOneUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: "Internal server error" });
  }
});

//GET /auth/verify - Verifies that the JWT sent by the client is valid
router.get("/verify", isAuthenticated, (req, res) => {
  res
    .status(200)
    .json({ message: "Token is valid :) ", decodedToken: req.payload });
});

module.exports = router;
