const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

const dbConnection = require("./config/database");

const ApiError = require("./utils/ApiError");

const authRoute = require("./routes/authRoute");
const usersRoute = require("./routes/usersRoute");
const postRoute = require("./routes/postRoute");

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
app.use("/api/posts", postRoute);

// Handel unhandelling Routes
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't found this Route : ${req.originalUrl}`, 400));
});

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App Running on port ${PORT}`);
});

process.on("unhandledRejection", (error) => {
  console.log(`unhandledRejection Error : ${error.name} | ${error.message}`);
  server.close(() => {
    console.error("Shutting down.... ");
    process.exit(1);
  });
});
