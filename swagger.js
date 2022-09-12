const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_autogen.json'
// TODO: Add the other routes when they are complete
const endpointsFiles = ['app/routes/restaurant.routes.js', 'app/routes/helpers.routes.js'] 

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
  "basePath": "/api",
  "host": undefined,
  "schemes": undefined,
  "consumes": [
    "application/json"
  ],
  "produces": [
    "application/json"
  ],
  definitions: {
    Restaurant: {
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
        country: 'Argentina'
      },
      $restaurantTypes: ['Italian', 'Pizza'],
      menuCategories: ['Pizza', 'Pasta'],
      menu: {$ref: '#/definitions/Menu'},
      reviews: [{$ref: '#/definitions/Review'}],
      isClosedOverwrite: false
    },
    Restaurants: [
      {$ref: '#/definitions/Restaurant'}
    ],
    Owner: {
      name: 'Jhon Doe',
      $email: 'the-coolest@anydomain.com',
      $password: '123456',
      restaurants: {
        $ref: '#/definitions/Restaurant'
      },
    },
    Dish: {
      $name: 'Pizza Margarita',
      $price: 1000,
      description: 'Pizza con tomate, queso y albahaca',
      $category: 'Pizzas',
      $ingredients: ['tomate', 'queso', 'albahaca'],
      isVegan: false,
      isGlutenFree: false,
      $restaurant: {
        $ref: '#/definitions/Restaurant'
      },
    },
    Review: {
      $rating: 5,
      comment: 'Muy buena pizza',
      $restaurant: {
        $ref: '#/definitions/Restaurant'
      },
    },
    Menu: [
      {$ref: '#/definitions/Dish'}
    ],
  }
}

swaggerAutogen(outputFile, endpointsFiles, doc);
