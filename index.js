const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const cors = require("cors");
const { validateToken } = require("./JWT");
const { PORT, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } = require("./config");

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
  host: DB_HOST,
  user: DB_USER,
  port: DB_PORT,
  password: DB_PASSWORD,
  database: DB_NAME,
});

db.connect((error) => {
  if (error) {
    console.log("damn, there is a problem again!");
    console.log(error);
  } else {
    console.log("db connected");
  }
});

app.get("/", (req, res) => {
  res.send("Hello my friend!");
});

app.use("/auth", require("./routes/auth"));
app.use("/update", require("./routes/update"));

app.get("/cabinet", validateToken, (req, res) => {
  db.query("SELECT * FROM users", (error, data, fields) => {
    if (error) {
      return res.status(403).send({ message: "Error has ocurred in DB, please try again" });
    }

    if (data && data.length > 0) {
      res.send(data);
    }
  });
});

app.listen(PORT, () => console.log(`Listening to port ${PORT}`));
