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
  
    app.use("/api/owners", router);
  };
  