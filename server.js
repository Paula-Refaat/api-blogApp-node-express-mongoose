const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const dbConnection = require("./config/database");

dotenv.config({ path: "config.env" });

const authRoute = require("./routes/authRoute");
const usersRoute = require("./routes/usersRoute");


// Connection to db
dbConnection();

// init app
const app = express();

// test Route
app.get("/", (req, res, next) => {
  res.send("App Running...");
});

// Miidlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}
app.use(express.json());


// Mount Routers
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);


// Running the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server is running on PORT : ${PORT}`);
});
