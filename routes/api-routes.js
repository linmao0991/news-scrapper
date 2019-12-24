var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

mongoose.connect("mongodb://localhost/newsarticlesdb", { useNewUrlParser: true });

module.exports = function (app) {
    app.get("/scrapetheearticles", function (req, res){
        wapoScrape();
        //reutersScrape();
    });
}

function wapoScrape(){
    axios.get("https://www.washingtonpost.com").then(function(response){
        var $ = cheerio.load(response.data);
        var site = "https://www.washingtonpost.com"

        $("div.pb-feature").each(function(i, element){
            
            var result = {}
            if($(this).find("li.byline")){
                var tempVar = $(this).find("li.byline").find("span").each(function(){
                    tempVar =  tempVar + $(this).text();
                })
                console.log(tempVar);

                // result.site = site;
                // result.title = $(this).find("h1.headline").text();
                // result.link = $(this).find("a").attr("href");
                // result.timestamp = $(this).find("li.timestamp").text();
                // result.snippet = $(this).find("div.blurb").text();
            
                // db.articles.create(result).then(function(dbArticle){
                //     console.log(dbArticle);
                // }).catch(function(err){
                //     console.log(err);
                // });
                console.log("True");
            }else{
                console.log("False");
            }
        });
    });
}

function reutersScrape(){
    axios.get("https://www.reuters.com").then(function(response){
        var site = "https://www.reuters.com"
        var $ = cheerio.load(response.data);

        $("article.story").each(function(i, element){
            var result = {}
            result.site = site;
            result.title = $(this).children("div.story-content").children("a").children("h3").text().trim();
            result.link = site+$(this ).children("div.story-content").children("a").attr("href");
            result.timestamp = $(this).find("span.timestamp").text();
            result.snippet = $(this).find("p").text();
        
            db.articles.create(result).then(function(dbArticle){
                console.log(dbArticle);
            }).catch(function(err){
                console.log(err);
            });
        });
    });
}