const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { userCollection } = require('../schema/userSchema');
const { isUserLoggedIn } = require('../middlewares/isUserLoggedIn');

router.post('/register', async (req, res) => {
  const saltRouds = 10;
  const salt = bcrypt.genSaltSync(saltRouds);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);
  try {
    const newUser = await userCollection.create({
      fullName: req.body.fullName,
      userName: req.body.userName,
      role: req.body.role,
      password: hashedPassword,
    });

    return res
      .status(201)
      .json({ message: `User created successfully`, newUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `Error encountered while trying to create a new user`,
      error,
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const userDetails = await userCollection.findOne({
      userName: req.body.userName,
    });

    if (!userDetails) {
      return res.status(400).json({ message: `User not found`, userDetails });
    }

    const doesPasswordMatch = bcrypt.compareSync(
      req.body.password,
      userDetails.password
    );

    if (!doesPasswordMatch) {
      return res.status(400).json({ message: `Invalid login details` });
    }

    const token = jwt.sign(
      {
        userName: userDetails.userName,
        userId: userDetails._id,
        role: userDetails.role,
      },
      process.env.SECRET
    );

    return res.status(200).json({ message: `Sign-in successful`, token });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: `Error, try another user.`, error });
  }
});

router.get('/profile', isUserLoggedIn, async (req, res) => {
  try {
    const userProfile = await userCollection.findById(
      req.decoded.userId,
      `-password`
    );
    res.json({ userProfile });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Internal server error`, error });
  }
});

module.exports = router;
