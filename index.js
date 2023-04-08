const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const DbConnection = require("./utils/DbConnection");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 4001;

app.use(cookieParser());

app.use(express.json());
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

app.get("/", (req, res) => {
  return res.status(200).send("ok from server");
});

//database call
DbConnection();

let origin = "http://localhost:3000";
if (process.env.NODE === "produaction") {
  origin = process.env.CLIENT_ORIGIN;
}
app.use(
  cors({
    origin,
    credentials: true,
  })
);
//api end points
app.use("/user", userRoutes);
app.use("/auth", authRoutes);
