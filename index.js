const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const cors = require("cors");
const { validateToken } = require("./JWT");

dotenv.config({ path: "./.env" });

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "https://mrkarimoff.github.io",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
// app.use(cors());

const db = mysql.createConnection({
  host: "containers-us-west-70.railway.app",
  user: "root",
  port: 6059,
  password: "6cJmt6GCYe2rLNyB7vkc",
  database: "railway",
});

db.connect((error) => {
  if (error) {
    console.log("fuck there is a problem");
    console.log(error);
  } else {
    console.log("db connected");
  }
});

app.use("/auth", require("./routes/auth"));
app.use("/update", require("./routes/update"));

app.get("/", validateToken, (req, res) => {
  db.query("SELECT * FROM users", (error, data, fields) => {
    if (error) {
      return res.status(403).send({ message: "Error has ocurred in DB, please try again" });
    }

    if (data && data.length > 0) {
      res.send(data);
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening to port ${PORT}`));
