$(document).ready(function(){
    $("#scrap-articles").on("click", function(){
        console.log("clicked")
        $.get("scrapetheearticles", function(data){}).then(function(repsonse){
            console.log(repsonse);
        })
    });
});