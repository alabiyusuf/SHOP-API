const express = require('express');

const app = express();

require('dotenv').config();

const port = process.env.PORT;

const mongoose = require('mongoose');

const connect = mongoose.connect(process.env.MONGO_URI);

const shopItemsRoute = require('./routes/shopRoutes.js');

const authRoute = require('./routes/authRoutes.js');

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use('/v1/shops', shopItemsRoute);

app.use('/v1/auth', authRoute);

app.listen(
  port,
  connect
    .then(() => {
      console.log(`Connected to the database successfully.`);
    })
    .catch((error) => {
      console.log(`Error connecting to the database`, error);
    }),
  () => {
    console.log(`Server is listening on port ${port}`);
  }
);
