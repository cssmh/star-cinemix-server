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

// async function run() {
  // try {

    // app.get("/type-movies/:type", async (req, res) => {
    //   try {
    //     const getType = req.params.type;
    //     const result = await cineCollection
    //       .find({
    //         $expr: { $eq: [{ $toLower: "$media" }, getType] },
    //       })
    //       .toArray();

    //     res.send({ result, getType });
    //   } catch (error) {
    //     console.log(error);
    //     res.status(500).send("An error occurred while fetching data.");
    //   }
    // });

    // Ping the database to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. Successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }
// }

// run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Book Your Cinema Ticket");
});

app.listen(port, () => {
  console.log(`CRUD IS RUNNING ON PORT ${port}`);
});
