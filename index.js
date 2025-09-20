const express = require("express");
const cors = require("cors");
const router = require("./routes/cineRoutes");
const app = express();
require("dotenv").config();
const port = 5000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://cinemix-2ceee.web.app",
      "https://cinemamix.netlify.app",
      "https://cinemix.surge.sh",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(router);

app.get("/", (req, res) => {
  res.send("Book Your Cinema Ticket");
});

app.listen(port, () => {
  console.log(`CRUD IS RUNNING ON PORT ${port}`);
});
