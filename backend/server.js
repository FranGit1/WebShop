const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const port = process.env.PORT || 8081;
const mysql = require("promise-mysql");
const api = require("./app/routes/api");
const config = require("./config");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const crypto = require("crypto");

let pool;
let apiRouter;
let authRouter;

initDb = async () => {
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  pool = await mysql.createPool(config.pool);

  apiRouter = api(express, pool, jwt, config.secret, crypto);
  app.use("/api", apiRouter);

  authRouter = require("./app/routes/authenticate")(
    express,
    pool,
    jwt,
    config.secret,
    crypto
  );
  app.use("/authenticate", authRouter);
  app.use(express.static(__dirname + "/public/app"));

  app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type,  Authorization"
    );
    next();
  });

  app.use(morgan("dev"));
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/app/index.html"));
  });
};

initDb();

app.listen(port);
console.log("Running on port " + port);
