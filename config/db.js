const mysql = require("mysql");

const db = mysql.createConnection({
  host: "containers-us-west-70.railway.app",
  user: "root",
  port: 6059,
  password: "6cJmt6GCYe2rLNyB7vkc",
  database: "railway",
});

module.exports = db;
