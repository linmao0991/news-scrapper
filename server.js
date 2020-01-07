var express = require("express");
var PORT = 3000;
var app = express();
var MONGODB_URI = process.env.MONGOD_URI || "mongodb: //localhost/mongoHeadlines"

// Parse request body as JSON
mongoose.connect(MONGODB_URI);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});
  