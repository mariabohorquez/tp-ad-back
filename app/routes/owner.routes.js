module.exports = app => {
    const owners = require("../controllers/owner.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Owner
    router.post("/", owners.create);
  
    // Retrieve all owners
    router.get("/", owners.findAll);
  
    // Retrieve a single owner with id
    router.get("/:id", owners.findOne);
  
    // Update an owners with id
    router.put("/:id", owners.update);
  
    // Delete an owner with id
    router.delete("/:id", owners.delete);

    // Retrieve all owner restaurants
    router.get("/:id/restaurants", owners.findAllRestaurants);

    // Retrieve a single restaurant from owner with id
    router.get("/:id/restaurants/:restaurantId", owners.findOneRestaurant);

    app.use("/api/owners", router);
  };
  