require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const app = express();

// MIDDLEWARE

// Attaches any data on a request to the req as json
app.use(express.json());

// Fires for every request that comes in, logs everything
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next(); // next must be called otherwise the request's main function won't happen
});

// ROUTES
// The "/api/notes/" says use `routes` if request goes here -- makes it relative
app.use("/api/notes", routes);
app.use("/api/tags", routes);

// Connect to DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // Listen for requests only when connected
    app.listen(process.env.PORT, () => {
      console.log(
        "___ CONNECTED TO DB AND LISTENING ON PORT",
        process.env.PORT,
        "___"
      );
    });
  })
  .catch((error) => {
    console.log(error);
  });
