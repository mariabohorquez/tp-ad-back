module.exports = app => {
  const restaurants = require("../controllers/restaurant.controller.js");

  var router = require("express").Router();

  // Create a new Restaurant
  router.post("/", restaurants.create);

  // Retrieve all restaurants
  router.get("/", restaurants.findAll);

  // Retrieve all published restaurants
  router.get("/published", restaurants.findAllPublished);

  // Retrieve a single Restaurants with id
  router.get("/:id", restaurants.findOne);

  // Update a Restaurants with id
  router.put("/:id", restaurants.update);

  // Delete a Restaurants with id
  router.delete("/:id", restaurants.delete);

  // Create a new Restaurants
  router.delete("/", restaurants.deleteAll);

  app.use("/api/restaurants", router);
};
