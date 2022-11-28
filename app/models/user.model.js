const bcrypt = require('bcrypt')

module.exports = mongoose => {
  const schema = mongoose.Schema({
    role: {
      type: String,
      enum: ['user', 'owner'],
      default: 'user'
    },
    google: {
      id: {
        type: String,
        unique: true
      },
      name: {
        type: String
      },
      email: {
        type: String,
        unique: true
      },
      photoUrl: {
        type: String,
        required: false
      }
    },
    custom: {
      email: {
        type: String,
        unique: true
      },
      password: {
        type: String,
        unique: false
      },
      name: {
        type: String,
        unique: false
      }
    },
    profilePicture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'image'
    },
    favoriteRestaurants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'restaurant'
      }
    ],
    ownedRestaurants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'restaurant'
      }
    ],
    coordinates: {
      latitude: {
        type: Number,
        required: false,
        unique: false
      },
      longitude: {
        type: Number,
        required: false,
        unique: false
      }
    },
    isLoggedIn: {
      type: Boolean
    }
  }, {
    timestamp: true
  })

  schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject()
    object.id = _id
    return object
  })

  // hash the password before the user is saved
  schema.pre('save', function hashPassword (next) {
    // hash the password only if the password has been changed or user is new
    if (!this.isModified('custom.password')) {
      console.log('password not modified')
      next()
      return
    }

    // generate the hash
    console.log('hashing password: ' + this.custom.password)
    bcrypt.hash(this.custom.password, 10, (err, hash) => {
      if (err) {
        next(err)
        return
      }

      // change the password to the hashed version
      this.custom.password = hash
      next()
    })
  })

  // method to compare a given password with the database hash
  schema.methods.comparePassword = function comparePassword (password) {
    console.log('password ' + password)
    console.log('this.password ' + this.custom.password)
    const data = bcrypt.compareSync(password, this.custom.password)
    return data
  }

  schema.methods.toUserObject = function toUserObject () {
    const { __v, _id, ...object } = this.toObject();

    let user = {
      
    };

    const isUser = object.role === 'user';
    user.id = _id;
    user.role = object.role;
    user.name = isUser ? object.google.name : object.custom.name;
    user.email = isUser ? object.google.email : object.custom.email;
    user.coordinates = object.coordinates;
    user.isLoggedIn = object.isLoggedIn;
    user.favoriteRestaurants = object.favoriteRestaurants;
    user.ownedRestaurants = object.ownedRestaurants;

    if (object.profilePicture.data)
      user.profilePicture = object.profilePicture.data.toString('base64');
    else
      user.profilePicture = object.profilePicture;
    
    return user;
  }
 
  schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject()

    object.id = _id;

    if (object.profilePicture.data)
      object.profilePicture = object.profilePicture.data.toString('base64');

    return object;
  })


  const User = mongoose.model('user', schema)
  return User
}
