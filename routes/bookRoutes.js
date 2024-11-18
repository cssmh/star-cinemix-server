const {
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
} = require("../controllers/cinemix");

const express = require("express");
const router = express.Router();

router.get("/now-playing", getNowPlaying);
router.get("/top-movies", getTopMovies);
router.get("/my-bookings/:email", getMyBookings);
router.get("/cine", getCine);
router.get("/cine/:id", getSingleCine);

router.post("/cine", postCine);
router.post("/add-booking", addBooking);

router.put("/cart-payment", cartPayment);
router.put("/cine/:id", updateCine);

router.delete("/my-booking/:id", deleteCine);

module.exports = router;
