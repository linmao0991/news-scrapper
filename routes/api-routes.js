var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

mongoose.connect("mongodb://localhost/newsarticlesdb", { useNewUrlParser: true });

module.exports = function (app) {
    app.get("/scrapetheearticles", function (req, res){
        wapoScrape();
        reutersScrape();
    });
}

function wapoScrape(){
    axios.get("https://www.washingtonpost.com").then(function(response){
        var $ = cheerio.load(response.data);
        var site = "Washington Post";
        var url = "https://www.washingtonpost.com";

        $("div[moat-id='homepage/story-ans']").each(function(i, element){
            var result = {}
            result.site = site;
            result.title = $(this).find(".headline").children("a").text().trim();
            result.link = $(this).find(".headline").children("a").attr("href");
            if(result.title.length = 0){
                result.title = false;
                result.link = false;
            }
            result.timestamp = $(this).find("li.timestamp").text();
            result.snippet = $(this).find("div.blurb").text();
            if(result.snippet.length === 0){
                result.snippet = "No Blurb";
            }

            if(result.title && result.link){
                db.articles.create(result).then(function(dbArticle){
                    //console.log(dbArticle);
                }).catch(function(err){
                    console.log(err);
                });
                console.log(result);
            }else{
                console.log("No Article")
                console.log("Skip insert into database");
            }
        });
        console.log("Complete");
    });
}

function reutersScrape(){
    axios.get("https://www.reuters.com").then(function(response){
        var site = "Reuters"
        var url = "https://www.reuters.com"
        var $ = cheerio.load(response.data);

        //Top Story
        $("section#topStory").each(function(i, element){
            var result = {}
            result.site = site;
            result.title = $(this).find("h2.story-title").children("a").text().trim();
            result.link = url+$(this).find("h2.story-title").children("a").attr("href");
            result.timestamp = $(this).find("span.timestamp").text();
            if(result.timestamp){
                console.log("True")
            }else{
                console.log("No Time Stamp");
                result.timestamp = "No Time Stamp";
            }
            result.snippet = $(this).find("p").text();
        
            db.articles.create(result).then(function(dbArticle){
                console.log(dbArticle);
            }).catch(function(err){
                console.log(err);
            });
        });

        //Top news
        $("article.story").each(function(i, element){
            var result = {}
            result.site = site;
            result.title = $(this).children("div.story-content").children("a").children("h3").text().trim();
            result.link = url+$(this ).children("div.story-content").children("a").attr("href");
            result.timestamp = $(this).find("span.timestamp").text();
            result.snippet = $(this).find("p").text();
        
            db.articles.create(result).then(function(dbArticle){
                console.log(dbArticle);
            }).catch(function(err){
                console.log(err);
            });
        });
        console.log("Complete");
    });
}