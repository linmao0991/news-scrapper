
function getAllArticles(){
    $.get("/getallarticles", function(data){}).then(function(response){
        console.log(response);
        response.map(function(article, index){
            var card =  `<div class="row">
                            <div class="col">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title"><a href="${article.link}" target="_blank">${article.title}</a></h5>
                                        <p class="card-text">${article.snippet}</p>
                                        <footer class="blockquote-footer">${article.site}</footer>
                                    </div>
                                </div>
                            </div>
                        </div>`

            $("#articles").append(card);
        })

    })
}

$(document).ready(function(){
    $("a.newsSite").on("click", function(){
        console.log("Scraping "+$(this).text())
        $.get("scrapetheearticles/"+$(this).text(), function(data){}).then(function(repsonse){
            console.log(repsonse);
        })
    });

    getAllArticles()
});