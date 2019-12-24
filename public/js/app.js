$(dcoument).ready(function(){

    $("scrap-articles").on("click", function(){
        $.get("scrapetheearticles", function(data){}).then(function(repsonse){
            console.log(repsonse);
        })
    });
});