module.exports = app => {
  const router = require('express').Router()

  // Health check
  router.get('/health', (req, res) => {
    // #swagger.tags = ['Health Check']
    // #swagger.description = 'Health check'
    res.send('OK').status(200)
  })

  app.use('/api/v1', router)
}
