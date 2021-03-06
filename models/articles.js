var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var articlesScehema = new Schema({
    site:{
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    link:{
        type: String,
        required: true
    },
    snippet: {
        type: String,
    },
    timestamp: {
        type: String,
    }
});

var articles = mongoose.model("article", articlesScehema);

module.exports = articles;