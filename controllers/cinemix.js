const { ObjectId } = require("mongodb");
const client = require("../config/db");
const cineCollection = client.db("CinemixDB").collection("cinemix");
const bookingCollection = client.db("CinemixDB").collection("mycart");

const getNowPlaying = async (req, res) => {
  try {
    const result = await cineCollection.find().sort({ _id: -1 }).toArray();
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while fetching data.");
  }
};

const getTopMovies = async (req, res) => {
  try {
    const result = await cineCollection.find().toArray();
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while fetching data.");
  }
};

const getMyBookings = async (req, res) => {
  try {
    const query = { user_email: req.params.email };
    const result = await bookingCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while fetching cart data.");
  }
};

const getCine = async (req, res) => {
  try {
    const result = await cineCollection.find().toArray();
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while fetching data.");
  }
};

const getSingleCine = async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const result = await cineCollection.findOne(query);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while fetching the document.");
  }
};

const postCine = async (req, res) => {
  try {
    const result = await cineCollection.insertOne(req.body);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while adding data.");
  }
};

const addBooking = async (req, res) => {
  try {
    const result = await bookingCollection.insertOne(req.body);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while adding to cart.");
  }
};

const cartPayment = async (req, res) => {
  try {
    const { selectedItems } = req.body;
    if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
      return res.status(400).send("Invalid item IDs provided.");
    }
    const objectIds = selectedItems.map((id) => new ObjectId(id));
    const result = await bookingCollection.updateMany(
      { _id: { $in: objectIds }, payment: { $ne: "success" } },
      { $set: { payment: "success" } }
    );

    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while adding data.");
  }
};

const updateCine = async (req, res) => {
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
    const result = await cineCollection.updateOne(filter, updateDoc, options);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while updating the document.");
  }
};

const deleteCine = async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const result = await bookingCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while deleting cart data.");
  }
};

module.exports = {
  getNowPlaying,
  getTopMovies,
  getMyBookings,
  getCine,
  getSingleCine,
  postCine,
  addBooking,
  cartPayment,
  updateCine,
  deleteCine,
};
