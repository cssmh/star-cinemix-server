const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongo code
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t6peb0q.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // main code
    const cineCollection = client.db("CinemixDB").collection("cinemix");
    const cartCollection = client.db("CinemixDB").collection("mycart");

    app.post("/cine", async (req, res) => {
      const getData = req.body;
      const result = await cineCollection.insertOne(getData);
      res.send(result);
    });

    app.get("/cine", async (req, res) => {
      const result = await cineCollection.find().toArray();
      res.send(result);
    });

    // find a document to update, first get single one
    app.get("/cine/:id", async (req, res) => {
      const paramsId = req.params.id;
      const query = { _id: new ObjectId(paramsId) };
      const result = await cineCollection.findOne(query);
      res.send(result);
    });
    // time to update
    app.put("/cine/:id", async (req, res) => {
      const paramsId = req.params.id;
      const updatedData = req.body;
      const filter = { _id: new ObjectId(paramsId) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedData.name,
          image: updatedData.image,
          media: updatedData.media,
          media_type: updatedData.media_type,
          price: updatedData.price,
          description: updatedData.description,
          rating: updatedData.rating,
        },
      };
      const result = await cineCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });
    // find a document to update end

    // Add to cart button to my cart data to database
    app.post("/cart", async (req, res) => {
      const getDataFromClient = req.body;
      const result = await cartCollection.insertOne(getDataFromClient);
      res.send(result);
    });
    // Add to cart button to my cart data to database end
    // get cart data all
    app.get("/cart", async (req, res) => {
      const result = await cartCollection.find().toArray();
      res.send(result);
    });
    // get cart data all end
    // delete cart
    app.delete("/cart/:id", async (req, res) => {
      const paramsId = req.params.id;
      const query = { _id: new ObjectId(paramsId) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });
    // delete cart end
    // main code end
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
// mongo code end

app.get("/", (req, res) => {
  res.send("CRUD RUNNING SUCCESSFULLY");
});

app.listen(port, () => {
  console.log(`CRUD IS RUNNING ON PORT ${port}`);
});
