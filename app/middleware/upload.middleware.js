const multer = require('multer')
const util = require('util')
const { GridFsStorage } = require('multer-gridfs-storage')

const db = require('../models')
const promise = db.mongoose
  .connect(db.url + '/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true
  })
  .then(() => {
    console.log('Ready to receive images')
  })
  .catch(err => {
    console.log('Failed when trying to establish a connection to image db', err)
    process.exit()
  })


const storage = new GridFsStorage({
  db: promise,
  file: (req, file) => {
    const match = ['image/png', 'image/jpeg', 'image/jpg']

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-morfando-${file.originalname}`
      console.log(filename)
      return filename
    }

    return {
      bucketName: 'photos',
      filename: `${Date.now()}-morfando-${file.originalname}`
    }
  }
})

const uploadFiles = multer({ storage }).single('file')
const uploadFilesMiddleware = util.promisify(uploadFiles)
module.exports = uploadFilesMiddleware
