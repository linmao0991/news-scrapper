var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

mongoose.connect("mongodb://localhost/newsarticlesdb", { useNewUrlParser: true });


module.exports = function (app) {
    // Scrape Articles
    app.get("/scrapetheearticles/:site", function (req, res){
        switch (req.params.site){
            case "Washington Post":
                wapoScrape().then(function(response){
                    var asyncArticle = async function (articles){
                        await Promise.all(articles.map(async function(article){await createArticle(article)}))
                        res.json("Completed "+articles.length+" Articles from Washington Post");
                    }
                    asyncArticle(response);
                });
                break;
            case "Reuters":
                reutersScrape().then(function(response){
                    var asyncArticle = async function (articles){
                        await Promise.all(articles.map(async function(article){await createArticle(article)}))
                        res.json("Completed "+articles.length+" Articles from Reuters");
                    }
                    asyncArticle(response);
                });
                break;
        }``
    })

    //Get all articles from DB
    app.get("/getallarticles", function(req, res){
        db.articles.find({})
        .then(function(dbArticles){
            res.json(dbArticles)
        })
        .catch(function(err){
            res.json(err);
        })
    });

    // Route for grabbing all comments for specific article
    app.get("/articles/comments/:id", function(req, res) {
        db.comments.find({articleId: req.params.id })
        // ..and populate all of the notes associated with it
        .then(function(dbComments) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbComments);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });

    // Route for saving/updating an Article's associated Note
    app.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
        db.comments.create(req.body)
        .then(function(dbComment) {
            res.json(dbComment);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });
}

function wapoScrape(){
    return new Promise((resolve, reject) => {
        axios.get("https://www.washingtonpost.com").then(function(response){
            var $ = cheerio.load(response.data);
            var site = "Washington Post";
            var url = "https://www.washingtonpost.com";
            var articles = []
    
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
                    articles.push(result);
                }else{
                    console.log("No Article")
                    console.log("Skip insert into database");
                }
            });
            resolve(articles);
        });
    })
}

function reutersScrape(){
    return new Promise((resolve, reject) => {
        axios.get("https://www.reuters.com").then(function(response){
            var site = "Reuters"
            var url = "https://www.reuters.com"
            var $ = cheerio.load(response.data);
            var articles = []
            
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
                articles.push(result);
            });
    
            //Top news
            $("article.story").each(function(i, element){
                var result = {}
                result.site = site;
                result.title = $(this).children("div.story-content").children("a").children("h3").text().trim();
                result.link = url+$(this ).children("div.story-content").children("a").attr("href");
                result.timestamp = $(this).find("span.timestamp").text();
                result.snippet = $(this).find("p").text();
                articles.push(result);
            });
            resolve(articles);
        });
    });
}

// async function asyncArticle(articles){
//     await Promise.all(articles.map(async function(article){await createArticle(article)}))
//         .then(function(){
//             reslove(true);
//         });
// }

function createArticle(article){
    return new Promise(function(resolve, reject){
        db.articles.create(article).then(function(dbArticle){
            console.log(dbArticle);
            resolve("success");
        }).catch(function(err){
            console.log(err);
            reject("failed")
        });
    })
}