const express = require("express");
const cors = require("cors");

const app = express();

// Swagger documentation
// https://levelup.gitconnected.com/how-to-add-swagger-ui-to-existing-node-js-and-express-js-project-2c8bad9364ce
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_autogen.json')
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// Base route
app.get("/", (req, res) => {
  res.json({ message: "Server is running." });
});

require("./app/routes/restaurant.routes")(app);
// require("./app/routes/owner.routes")(app);
// require("./app/routes/user.routes")(app);
require("./app/routes/helpers.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
