var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var commentsScehema = new Schema({
    articleId: String,
    title: String,
    body: String,
});

var comments = mongoose.model("comments", commentsScehema);

module.exports = comments;