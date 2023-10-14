const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const dbConnection = require("./config/database");

dotenv.config({ path: "config.env" });

// Connection to db
dbConnection();

// init app
const app = express();

// test Route
app.use("/", (req, res, next) => {
  res.send("App Running...");
});

// Miidlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}
app.use(express.json());

// Running the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server is running on PORT : ${PORT}`);
});
