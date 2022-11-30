const multer = require('multer')

const multerStorage = multer.memoryStorage()
const multerUploader = multer({ storage: multerStorage })

module.exports = multerUploader
