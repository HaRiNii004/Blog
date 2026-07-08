const express = require("express");
const cors = require("cors");
const postRoutes = require("./routes/post.routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Journal API is running"));
app.use("/api/posts", postRoutes);

app.use(errorHandler); // must be last

module.exports = app;