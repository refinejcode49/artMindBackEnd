const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User.model");

// to create a new user
router.post("/signup", async (req, res) => {
  try {
    const salt = bcryptjs.genSaltSync(12);
    const hashedPassword = bcryptjs.hashSync(req.body.password, salt);
    const hashedUser = {
      ...req.body,
      password: hashedPassword,
    };
    // create the user in the DB
    const newUser = await UserModel.create(hashedUser);
    console.log("user created successfully", newUser);
    res.status(201).json({ message: "user successfully created in the DB" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// to login a user by email and password
router.post("/login", async (req, res) => {
  try {
    // find the user based on their email
    const foundUser = await UserModel.findOne({ email: req.body.email });
    if (!foundUser) {
      res.status(400).json({ errorMessage: "Email not found" });
    } else {
      // if the user email was found
      const passwordFromFrontEnd = req.body.password;
      const passwordHashedInDb = foundUser.password;
      //compare the passwordFromFrontEnd and the HashedPassword
      const passWordsMatch = bcryptjs.compareSync(
        passwordFromFrontEnd,
        passwordHashedInDb
      );
      //console.log("passwords match ?", passWordsMatch);
      if (!passWordsMatch) {
        res.status(400).json({ errorMessage: "Password incorrect" });
      }
      // the email exists and the password match
      const data = { _id: foundUser._id, username: foundUser.username };
      const authToken = jwt.sign(data, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "1w",
      });
      res.status(200).json({ message: "you are logged in!", authToken });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
