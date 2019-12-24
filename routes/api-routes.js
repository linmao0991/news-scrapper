var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

mongoose.connect("mongodb://localhost/news-articles-db", { useNewUrlParser: true });

module.exports = function (app) {
    app.get("/scrapetheearticles", function (req, res){
        axios.get("https://www.reuters.com").then(function(response){
            var $ = cheerio.load(response.data);

            $("article.story").each(function(i, element){
                var result = {}

                result.title = $(this).children(".story-title").text();
                result.link = $(this ).children("a").attr("href");
                result.timestamp = $(this).children("timestamp .article-time").text();
            
                db.articles.create(result).then(function(dbArticle){
                    console.log(dbArticle);
                }).catch(function(err){
                    console.log(err);
                })
            });
        });
        res.send("Scrape Complete");
    });
}