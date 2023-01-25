const express = require("express");
const db = require("../config/db");

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
