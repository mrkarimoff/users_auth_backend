const express = require("express");
const bcrypt = require("bcryptjs");
const { createTokens } = require("../JWT");
const mysql = require("mysql");
const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } = require("../config");

const db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  port: DB_PORT,
  password: DB_PASSWORD,
  database: DB_NAME,
});

const router = express.Router();

router.post("/register", (req, res) => {
  const { email, password, username } = req.body;
  const register_time = new Date();

  db.query("SELECT email FROM users WHERE email = ?", [email], async (error, results) => {
    console.log("hey hello");
    if (error) {
      console.log("fuck error again");
      console.log(error);
    }

    if (results.length > 0) {
      return res.status(403).send({ message: "This email is alredy in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    // console.log(hashedPassword);

    db.query(
      "INSERT INTO users SET ?",
      {
        username: username,
        email: email,
        password: hashedPassword,
        register_time: register_time,
      },
      (error, results) => {
        if (error) {
          console.log("son of a bitch");
          console.log(error);
        } else {
          return res.send({ message: "User registered successfully!" });
        }
      }
    );
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email], (error, data, fields) => {
    if (error) {
      return res.status(403).send({ message: "Error has ocurred, please try again" });
    }

    if (data && data.length === 1) {
      if (data[0].status === 0)
        return res.status(403).send({ message: "User has been blocked by admin " });

      bcrypt.compare(password, data[0].password, (bcryptErr, verified) => {
        if (verified) {
          const login_time = new Date();
          db.query(
            `UPDATE users SET login_time = ? WHERE id = ?`,
            [login_time, data[0].id],
            (error, results, fields) => {
              if (error) {
                return console.error(error.message);
              }
            }
          );
          const accessToken = createTokens(data[0]);

          res.json({
            message: "User logged in successfully",
            access_token: accessToken,
            userId: data[0].id,
          });
        } else {
          return res.status(400).send({ message: "Password is incorrect" });
        }
      });
    } else {
      return res.status(400).send({ message: "Email does not exist" });
    }
  });
});

// status 204 means no content
router.get("/logout", (req, res) => {
  res.status(200).send({ message: "logged out successfully" });
});

module.exports = router;
