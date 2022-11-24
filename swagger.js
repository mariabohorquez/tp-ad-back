// Swagger Autogen: https://github.com/davibaltar/swagger-autogen#options
const options = {
  autoHeaders: false,     // Enable/Disable automatic headers capture. By default is true
  autoQuery: false,       // Enable/Disable automatic query capture. By default is true
  autoBody: false         // Enable/Disable automatic body capture. By default is true
}
const swaggerAutogen = require('swagger-autogen')(options)

const outputFile = './swagger_autogen.json'
const endpointsFiles = ['app/routes/utils.routes.js', 'app/routes/user.routes.js', 'app/routes/restaurant.routes.js']

const doc = { 
  "info": {
    "version": "1.0.0",
    "title": "Morfando API",
    "description": "Documentacion de la API de Morfando",
    "license": {
      "name": "MIT",
      "url": "https://opensource.org/licenses/MIT"
    }
  },
  "basePath": "/api/v1",
  "host": undefined,
  "schemes": undefined,
  "consumes": [
    "application/json"
  ],
  "produces": [
    "application/json"
  ],
  "definitions": { 
    Restaurant: {
      name: 'La Pizzeria',
      hours: {monday: {'open': 1000, 'close': 1400},
              tuesday: {'open': 1000, 'close': 1400},
              wednesday: {'open': 1000, 'close': 1400},
              thursday: {'open': 1000, 'close': 1400},
              friday: {'open': 1000, 'close': 1400},
              saturday: {'open': 1000, 'close': 1400},
              sunday: {'open': 1000, 'close': 1400}},
      priceRange: '$$',
      address: {
        streetName: 'Calle 1',
        streetNumber: 123,
        neighborhood: 'Palermo',
        city: 'Buenos Aires',
        state: 'Buenos Aires',
        country: 'Argentina'
      },
      $restaurantTypes: ['Italian', 'Pizza'],
      menuCategories: ['Pizza', 'Pasta'],
      isClosedOverwrite: false,
      averageRating: 4.5
    },
    createRestaurant: {
      $ownerId: 'Owner object ID',
      $name: 'La Pizzeria',
      $hours: {monday: {'open': 1000, 'close': 1400},
              tuesday: {'open': 1000, 'close': 1400},
              wednesday: {'open': 1000, 'close': 1400},
              thursday: {'open': 1000, 'close': 1400},
              friday: {'open': 1000, 'close': 1400},
              saturday: {'open': 1000, 'close': 1400},
              sunday: {'open': 1000, 'close': 1400}},
      $priceRange: '$$',
      address: {
        streetName: 'Calle 1',
        streetNumber: 123,
        neighborhood: 'Palermo',
        city: 'Buenos Aires',
        state: 'Buenos Aires',
        country: 'Argentina'
      },
      coordinates: {
        type: 'Point',
        coordinates: [-58.456, -34.567]
      },
      $restaurantTypes: ['Italian', 'Pizza'],
    },
    Restaurants: [
      {$ref: '#/definitions/Restaurant'}
    ],
    Owner: {
      name: 'Jhon Doe',
      $email: 'the-coolest@anydomain.com',
      $password: '123456',
      ownedRestaurants: {
        $ref: '#/definitions/Restaurant'
      },
    },
    User: {
      role: 'user',
      google: {
        name: 'Jane Doe',
        id: '1234567890',
        email: 'jane-doe@gmail.com',
      },
      custom: {
        name: 'Jane Doe',
        email: 'janedoe@gmail.com',
        password: '123456',
      },
      profilePicture: '',
      favoriteRestaurants: {
        $ref: '#/definitions/Restaurants',
      },
      ownedRestaurants: {
        $ref: '#/definitions/Restaurants',
      },
    },
    Dish: {
      $name: 'Pizza Margarita',
      $price: 1000,
      discounts: 0,
      description: 'Pizza con tomate, queso y albahaca',
      $category: 'Pizzas',
      $ingredients: ['tomate', 'queso', 'albahaca'],
      isVegan: false,
      isGlutenFree: false,
    },
    createReview: {
      $rating: 5,
      comment: 'Muy buena pizza',
    },
    Review: {
      $rating: 5,
      comment: 'Muy buena pizza',
    },
    Reviews: [
      {$ref: '#/definitions/Review'}
    ],
    Menu: [
      {$ref: '#/definitions/Dish'}
    ],
    createMenuCategory: {
      $name: 'Pizzas',
    },
    createUser: {
      role: "user or owner",   
      google: {
        name: 'Jane Doe',
        id: '1234567890',
        email: 'user@morfando.com',
        photoUrl: 'https://lh3.googleusercontent.com/a/mockphoto.jpg',
      },
      custom: {
        name: 'Jane Doe',
        email: 'owner@morfando.com',
        password: '123456'
      },
      coordinates: {
        longitude: 30.558965,
        latitude: 30.558965,
      }
    },
    credentials: {
      email: 'owner@morfando.com',
      password: '123456'
    },
    loginResponse: {
      id: "5f9f9f9f9f9f9f9f9f9f9f9f",
      email: "example@email.com",
      name: "Jane Doe",
      accessToken: "some access token"
    },
    emailRequest: {
      email: 'test@morfando.com'
    },
    recoveryRequest: {
      userId: "5f9f9f9f9f9f9f9f9f9f9f9f",
      token: "1234",
      password: "123456",
    },
    logoutRequest: {
      userId: "5f9f9f9f9f9f9f9f9f9f9f9f",
    },
  },
}

swaggerAutogen(outputFile, endpointsFiles, doc);
