const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const db = require("./models/db");

const app = express();
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

db.sync({ force: true })
  .then(() => {
    app.listen(5000, () => console.log(`Servidor  en el puerto 5000`));
  })
  .catch((error) => {
    console.error("Error sincronizando la database:", error);
  });
module.exports = app;
