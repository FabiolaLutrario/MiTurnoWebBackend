const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();
const db = require("./models/db");
const { User, Turn, BranchOffice } = require("./models");
const routes = require("./routes/index");

const app = express();
app.use(express.json());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use((err, req, res, next) => {
  res.status(500).send(err);
});

app.use("/api", routes);

db.sync({ force: false }).then(() => {
  app.listen(5000, () => console.log(`Servidor  en el puerto 5000`));
});
module.exports = app;
