const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();
    
    const cineCollection = client.db("CinemixDB").collection("cinemix");
    const cartCollection = client.db("CinemixDB").collection("mycart");

    app.post("/cine", async (req, res) => {
      try {
        const result = await cineCollection.insertOne(req.body);
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    app.get("/cine", async (req, res) => {
      try {
        const result = await cineCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    // find a document to update, first get single one
    app.get("/cine/:id", async (req, res) => {
      try {
        const query = { _id: new ObjectId(req.params.id) };
        const result = await cineCollection.findOne(query);
        res.send(result);
      } catch (error) {
        console.log(error);
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
      }
    });

    // Add to cart button to my cart data to database
    app.post("/cart", async (req, res) => {
      try {
        const getDataFromClient = req.body;
        const result = await cartCollection.insertOne(getDataFromClient);
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });
    
    // get cart data all
    app.get("/cart", async (req, res) => {
      try {
        const result = await cartCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });
    
    // delete cart
    app.delete("/cart/:id", async (req, res) => {
       try {
        const query = { _id: new ObjectId(req.params.id) };
        const result = await cartCollection.deleteOne(query);
        res.send(result);
       } catch (error) {
        console.log(error);
       }
    });
    // delete cart end
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
// mongo code end

app.get("/", (req, res) => {
  res.send("BOOK YOUR TICKET");
});

app.listen(port, () => {
  console.log(`CRUD IS RUNNING ON PORT ${port}`);
});
