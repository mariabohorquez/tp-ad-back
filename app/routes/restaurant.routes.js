module.exports = app => {
  const restaurants = require("../controllers/restaurant.controller.js");

  var router = require("express").Router();

  // Create a new Restaurant
  router.post("/", restaurants.create);

  // Retrieve all restaurants
  router.get("/", restaurants.findAll);

  // Retrieve all restaurants matching a regex
  router.get("/:name", restaurants.findAll);

  // Retrieve a single Restaurants with id
  router.get("/id/:id", restaurants.findOne);

  // Update a Restaurants with id
  router.put("/:id", restaurants.update);

  // Post a review to a restaurant
  router.post("/:id/review", restaurants.createReview);

  // Delete a Restaurants with id
  router.delete("/:id", restaurants.delete);

  // Set restaurant status to inactivate by force
  router.put("/:id/deactivate", restaurants.deactivate);

  // Remove closed by force flag
  router.put("/:id/activate", restaurants.activate);

  // Dishes CRUD
  router.post("/:restaurantId/dishes", restaurants.createDish);
  router.get("/:restaurantId/dishes", restaurants.findAllDishes);
  // router.get("/:restaurantId/dishes/:dishId", restaurants.findOneDish);
  // router.put("/:restaurantId/dishes/:dishId", restaurants.updateDish);
  // router.delete("/:restaurantId/dishes/:dishId", restaurants.deleteDish);

  // Dishes categories
  // router.post("/:restaurantId/dishes/categories", restaurants.createCategory);
  // router.get("/:restaurantId/dishes/categories", restaurants.getAllCategories);
  // router.delete("/:restaurantId/dishes/categories/:categoryId", restaurants.deleteCategory);
  // router.put("/:restaurantId/dishes/categories/:categoryId", restaurants.updateCategory);

  app.use("/api/restaurants", router);
};
