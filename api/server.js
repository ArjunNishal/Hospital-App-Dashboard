const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const panellogin = require("./routes/panelLoginRoutes");
const panelroles = require("./routes/PanelRoleRoutes");
const aboutusroutes = require("./routes/aboutusRoutes");
const blogsRoutes = require("./routes/BlogsRoutes");
const userroutes = require("./routes/UserRoutes");
const weekRoutes = require("./routes/WeeksRoutes");
const userloginroutes = require("./routes/userloginRoutes");
const authenticate = require("./middlewares/auth");
const userauth = require("./middlewares/userauth");

require("dotenv").config();
app.use(cors({ credentials: true, origin: "*" }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static("./uploads"));

// ROUTES
app.use("/api/admin-log", panellogin);
app.use("/api/admin-role", authenticate, panelroles);
app.use("/api/about", authenticate, aboutusroutes);
app.use("/api/blog", authenticate, blogsRoutes);
app.use("/api/weeks", authenticate, weekRoutes);
// App level routes
app.use("/api/user", userauth, userroutes);

app.use("/api/user-log", userloginroutes);

// __dirname = path.resolve();
// app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
// app.use(express.static(path.join(__dirname, "./build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });

//db connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("connected to mongo"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT, () =>
  console.log(`App listening on port ${process.env.PORT}!`)
);
