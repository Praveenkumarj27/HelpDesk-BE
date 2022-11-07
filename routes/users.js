var express = require("express");
var router = express.Router();
var dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const secret = process.env.JWTSECRETKEY;
const { dbName, dbUrl, mongodb, MongoClient } = require("../config/dbConfig");
const mongoClient = mongodb.MongoClient;

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/register", async function (req, res) {
  try {
    const connection = await mongoClient.connect(dbUrl);

    const db = connection.db(dbName);

    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(req.body.password, salt);
    req.body.password = hash;

    await db.collection("registered_users").insertOne(req.body);

    await connection.close();

    res.json({
      message: "Registerd sucessfully",
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async function (req, res) {
  try {
    const connection = await mongoClient.connect(dbUrl);

    const db = connection.db(dbName);

    const user = await db
      .collection("registered_users")
      .findOne({ email: req.body.email });
    if (user) {
      const match = await bcryptjs.compare(req.body.password, user.password);
      if (match) {
        const token = jwt.sign(
          { _id: user._id, typeofUser: user.typeOfUser },
          secret
        );
        console.log(token);

        res.send({
          message: "Sucessfully logged in",
          token,
          typeofUser: user.typeOfUser,
        });
      } else {
        res.status(401).json({
          message: "password incorrect",
        });
      }
    } else {
      res.status(401).json({
        message: "email incorrect",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
