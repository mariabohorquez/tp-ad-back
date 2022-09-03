module.exports = app => {
  const restaurants = require("../controllers/restaurant.controller.js");

  var router = require("express").Router();

  // Create a new Restaurant
  router.post("/", restaurants.create);

  // Retrieve all restaurants
  router.get("/", restaurants.findAll);

  // Retrieve all restaurants matching a regex
  router.get("/:name", restaurants.findByName);

  // Retrieve a single Restaurants with id
  router.get("/:id", restaurants.findOne);

  // Update a Restaurants with id
  router.put("/:id", restaurants.update);

  // Post a review to a restaurant
  router.post("/:id", restaurants.createReview);

  // Delete a Restaurants with id
  router.delete("/:id", restaurants.delete);

  // Dishes CRUD
  router.post("/:restaurantId/dishes", restaurants.createDish);
  router.get("/:restaurantId/dishes", restaurants.findAllDishes);
  router.get("/:restaurantId/dishes/:dishId", restaurants.findOneDish);
  router.put("/:restaurantId/dishes/:dishId", restaurants.updateDish);
  router.delete("/:restaurantId/dishes/:dishId", restaurants.deleteDish);

  app.use("/api/restaurants", router);
};
