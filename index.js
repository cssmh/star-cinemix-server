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
});

// Event listeners for connection
client.connect((err) => {
  if (err) {
    console.error("Failed to connect to MongoDB", err);
    return;
  }
  console.log("Connected to MongoDB");
});

async function run() {
  try {
    // Connect the client to the server
    // client.connect();

    const cineCollection = client.db("CinemixDB").collection("cinemix");
    const movieCollection = client.db("CinemixDB").collection("latestMovies");
    const cartCollection = client.db("CinemixDB").collection("mycart");

    app.get("/featured-movies", async (req, res) => {
      try {
        const result = await cineCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while fetching data.");
      }
    });

    app.put("/cart-payment", async (req, res) => {
      try {
        const { selectedItems } = req.body;
        if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
          return res.status(400).send("Invalid item IDs provided.");
        }
        const objectIds = selectedItems.map((id) => new ObjectId(id));
        const result = await cartCollection.updateMany(
          { _id: { $in: objectIds }, payment: { $ne: "success" } },
          { $set: { payment: "success" } }
        );

        res.send(result);
      } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while adding data.");
      }
    });

    app.post("/cine", async (req, res) => {
      try {
        const result = await cineCollection.insertOne(req.body);
        res.send(result);
      } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while adding data.");
      }
    });

    app.get("/latest-movies", async (req, res) => {
      try {
        const result = await movieCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while fetching data.");
      }
    });

    app.get("/type-movies/:type", async (req, res) => {
      try {
        const getType = req.params.type;
        const result = await cineCollection
          .find({
            $expr: { $eq: [{ $toLower: "$media" }, getType] },
          })
          .toArray();
          
        res.send({ result, getType });
      } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while fetching data.");
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

    app.post("/add-cart", async (req, res) => {
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
  res.send("Book Your Cinema Ticket");
});

app.listen(port, () => {
  console.log(`CRUD IS RUNNING ON PORT ${port}`);
});
