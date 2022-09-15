module.exports = app => {
  // const helpers = require('../controllers/utils.controller.js')

  const router = require('express').Router()

  // Health check
  router.get("/health", (req, res) => {
    // #swagger.tags = ['Health Check']
    // #swagger.description = 'Health check'
    res.send("OK").status(200);
  });

  // Upload image
  // These are associated directly to the user/owner/restaurants
  // No direct get method is provided
  // router.post('/uploadImage', helpers.uploadImage)

  // Auth routes
  // router.post('/auth/login', helpers.login)
  // router.post('/auth/register', helpers.register)
  // router.post('/auth/logout', helpers.logout)

  app.use('/api/v1', router)
}
