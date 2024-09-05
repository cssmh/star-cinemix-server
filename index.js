const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

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

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  connectTimeoutMS: 10000,
});

async function run() {
  try {
    // Connect the client to the server
    client.connect();

    const cineCollection = client.db("CinemixDB").collection("cinemix");
    const cartCollection = client.db("CinemixDB").collection("mycart");

    app.post("/cine", async (req, res) => {
      try {
        const result = await cineCollection.insertOne(req.body);
        res.send(result);
      } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while adding data.");
      }
    });

    app.get("/cine", async (req, res) => {
      try {
        const result = await cineCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while fetching data.");
      }
    });

    app.get("/cine/:id", async (req, res) => {
      try {
        const query = { _id: new ObjectId(req.params.id) };
        const result = await cineCollection.findOne(query);
        res.send(result);
      } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while fetching the document.");
      }
    });

    app.put("/cine/:id", async (req, res) => {
      try {
        const filter = { _id: new ObjectId(req.params.id) };
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            name: req.body.name,
            image: req.body.image,
            media: req.body.media,
            media_type: req.body.media_type,
            price: req.body.price,
            description: req.body.description,
            rating: req.body.rating,
          },
        };
        const result = await cineCollection.updateOne(
          filter,
          updateDoc,
          options
        );
        res.send(result);
      } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while updating the document.");
      }
    });

    app.post("/cart", async (req, res) => {
      try {
        const result = await cartCollection.insertOne(req.body);
        res.send(result);
      } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while adding to cart.");
      }
    });

    app.get("/cart/:email", async (req, res) => {
      try {
        const query = { user_email: req.params.email };
        const result = await cartCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while fetching cart data.");
      }
    });

    app.delete("/cart/:id", async (req, res) => {
      try {
        const query = { _id: new ObjectId(req.params.id) };
        const result = await cartCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while deleting cart data.");
      }
    });

    // Ping the database to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. Successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("BOOK YOUR TICKET");
});

app.listen(port, () => {
  console.log(`CRUD IS RUNNING ON PORT ${port}`);
});
