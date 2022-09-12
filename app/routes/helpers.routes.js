module.exports = app => {
  const owners = require('../controllers/owner.controller.js')

  const router = require('express').Router()

  // Health check
  router.get("/health", (req, res) => {
    // #swagger.tags = ['Health']
    // #swagger.description = 'Health check'
    res.send("OK").status(200);
  });

  app.use('/api', router)
}
