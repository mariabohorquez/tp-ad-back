module.exports = app => {
    const users = require("../controllers/user.controller.js");
  
    var router = require("express").Router();
  
    // Create a new user
    router.post("/", users.create);
  
    // Retrieve all users
    router.get("/", users.findAll);
  
    // Retrieve a single user with id
    router.get("/:id", users.findOne);
  
    // Update an users with id
    router.put("/:id", users.update);
  
    // Delete an user with id
    router.delete("/:id", users.delete);

    // Retrieve all user favorite restaurants
    router.get("/:id/favoriteRestaurants", users.findAllFavoriteRestaurants);

    // Add a favorite restaurant to the user
    router.post("/:id/favoriteRestaurants/:restaurantId", users.addFavoriteRestaurant);

    app.use("/api/users", router);
  };
  