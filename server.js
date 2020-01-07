var express = require("express");
var PORT = process.env.PORT || 3000;
var app = express();
var mongoose = require("mongoose");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsarticlesdb"

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
  