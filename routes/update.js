const express = require("express");
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

router.put("/block", (req, res) => {
  const userIds = req.body.selectedRowKeys;
  let clearUserId = false;

  userIds.map((id) => {
    db.query(`UPDATE users SET status = ? WHERE id = ?`, [0, id], (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
    });
  });

  const userId = Number(req.body.userId);
  if (userId >= 0 && userIds.includes(userId)) {
    clearUserId = true;
  }

  res.send({ message: "Selected users blocked successfully", clearUserId });
});

router.put("/unblock", (req, res) => {
  const userIds = req.body.selectedRowKeys;

  userIds.map((id) => {
    db.query(`UPDATE users SET status = ? WHERE id = ?`, [1, id], (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
    });
  });

  res.send({ message: "Selected users unblocked successfully" });
});

router.put("/delete", (req, res) => {
  const userIds = req.body.selectedRowKeys;
  let clearUserId = false;

  userIds.map((id) => {
    db.query(`DELETE FROM users WHERE id = ? `, [id], (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
    });
  });

  const userId = Number(req.body.userId);
  if (userId >= 0 && userIds.includes(userId)) {
    clearUserId = true;
  }

  res.send({ message: "Selected users deleted successfully", clearUserId });
});

module.exports = router;
