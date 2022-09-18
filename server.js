const express = require("express");
const cors = require("cors");

const app = express();

const swaggerFile = require('./swagger_autogen.json')
const swaggerUi = require('swagger-ui-express')
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, { swaggerOptions: { defaultModelsExpandDepth: 0 }}))

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
  res.status(200).send("Server is running.");
});

require("./app/routes/restaurant.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/utils.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
