
function getAllArticles(){
    $.get("/getallarticles", function(data){}).then(function(response){
        console.log(response);
        response.map(function(article, index){
                var card =  `<div class="row my-1">
                                <div class="col">
                                    <div class="card" id="${article._id}">
                                        <div class="card-body">
                                            <h5 class="card-title"><a href="${article.link}" target="_blank">${article.title}</a></h5>
                                            <p class="card-text">${article.snippet}</p>
                                            <footer class="blockquote-footer">${article.site}
                                                <span class="commentBtn btn badge badge-secondary float-right mx-1">Comments</span>
                                                <span class="addCommentBtn btn badge badge-secondary float-right mx-1">Add</span>
                                            </footer>
                                        </div>
                                    </div>
                                </div>
                            </div>`
                //$("#articles").append(card);
                $(card).hide().appendTo("#articles").fadeIn(500*index);
        });
    })
}

function getComments(id){
    return new Promise(function(resolve, reject){
        $("#comments").empty();
        $.get("/articles/comments/"+id, function(data){}).then(function(response){
            response.map(function(comment, index){
                var comments =  `<div class="row comment my-1">
                                    <div class="col">
                                        <div class="card bg-dark text-white" articleId="${comment.articleId}">
                                            <div class="card-body">
                                                <h5 class="card-title">${comment.title}</a></h5>
                                                <p class="card-text">${comment.body}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>`
                $(comments).hide().appendTo("#comments").fadeIn(450*index);
            });
            resolve("Comments Loaded");
        }).catch(function(err){
            reject(err)
        })
    })
}

var previousArticleId;

$(document).on("click", ".commentBtn", function(){
    if(previousArticleId){
        $("#"+previousArticleId).removeClass("bg-dark text-white");
        //$()
    }
    var currentCard = $(this).closest("div.card");
    var articleId = currentCard.attr("id");
    console.log(articleId);
    currentCard.toggleClass("bg-dark text-white");
    previousArticleId = articleId;
    getComments(articleId).then(function(response){
        console.log(response);
    });
})

$(document).on("click", ".addCommentBtn", function(){
    if(previousArticleId){
        $("#"+previousArticleId).removeClass("bg-dark text-white");
    }
    var currentCard = $(this).closest("div.card");
    var articleId = currentCard.attr("id");
    console.log(articleId);
    currentCard.toggleClass("bg-dark text-white");
    previousArticleId = articleId;
    $("form.comment").attr("articleId",articleId);
    $("#commentModal").modal("toggle");
})


$(document).ready(function(){
    $("a.newsSite").on("click", function(){
        console.log("Scraping "+$(this).text())
        $.get("scrapetheearticles/"+$(this).text(), function(data){}).then(function(repsonse){
            console.log(repsonse);
            getAllArticles()
        })
    });

    $("form.comment").on("submit", function(event){
        event.preventDefault();
        var articleId = $("form.comment").attr("articleId");
        var comment = {}
        comment.articleId = articleId;
        comment.title = $("#title").val().trim();
        comment.body = $("#comment").val().trim();
        console.log(comment);
        $.post("/articles/"+articleId, comment, function(){}).then(function(response){
            $("#commentModal").modal("toggle");
            getComments(articleId).then(function(response){
                console.log(response);
            });
        })
    })

    getAllArticles()
});