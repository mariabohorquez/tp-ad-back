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
      openingTime: {'hours': 12, 'minutes': 30},
      closingTime: {'hours': 22, 'minutes': 0},
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
      isClosedOverwrite: false
    },
    createRestaurant: {
      $ownerId: '5f9f9f9f9f9f9f9f9f9f9f9f',
      $name: 'La Pizzeria',
      $openingTime: {'hours': 12, 'minutes': 30},
      $closingTime: {'hours': 22, 'minutes': 0},
      $priceRange: '$$',
      address: {
        streetName: 'Calle 1',
        streetNumber: 123,
        neighborhood: 'Palermo',
        city: 'Buenos Aires',
        state: 'Buenos Aires',
        country: 'Argentina',
        longitude: -100.0,
        latitude: 50.0,
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
      discount: 0,
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
      location: {
        longitude: 30.558965,
        latitude: 30.558965,
      }
    },
    credentials: {
      email: 'owner@morfando.com',
      password: '123456'
    },
  },
}

swaggerAutogen(outputFile, endpointsFiles, doc);
