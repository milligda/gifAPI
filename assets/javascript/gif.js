$(document).ready(function() {

    var apiKey = "2dMmU36VbyBnmg6m95JD1hqKqaAMppHE";
    var startQueryURL = "https://api.giphy.com/v1/gifs/search?q=";
    var offset = 0; // giphy uses offset to determine the page.  25 items per page so page 2 would have an offset of 25, page 3 - 50

    var teams = ['miami heat', 'golden state warriors', 'cleveland cavaliers', 'boston celtics', 'los angeles lakers'];
    var displayNumber = offset + 24;


    function displayTeamButtons() {

        for (var i = 0; i < teams.length; i++) {
            
            var button = $("<button>");
            button.addClass('team-button');
            button.attr('data-team', teams[i]);
            button.text(teams[i]);
            button.appendTo('.team-buttons-container');
        }
    }

    function addTeam(event) {
        
        event.preventDefault();

        // pull the search term from the input field and store it as a variable
        var searchTerm = $("#search-term").val().trim();

        // add the search term to the teams array
        teams.push(searchTerm);

        // empty the team-buttons-container and then repopulate it with the new array
        $('.team-buttons-container').empty();
        displayTeamButtons();

        $("#search-term").val("");
    }

    function displayGifs(event) {

        var team = $(this).attr("data-team");

        team = team.replace(/ /g, "+");

        var queryURL = startQueryURL + team + "&api_key=" + apiKey + "&offset=" + offset;

        console.log(queryURL);

        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function(response) {

            var results = response.data;

            for (var i = 0; i < displayNumber; i++) {
                
                var gifTile = $("<div>");
                gifTile.addClass("gif-tile");

                var rating = results[i].rating;

                var p = $("<p>").text(rating);
                
                var gifImage = $("<img>");
                gifImage.attr('src', results[i].images.fixed_width.url);

                gifImage.appendTo(gifTile);
                p.appendTo(gifTile);
                gifTile.appendTo(".gifs-container");
            }

        });
    }

    // add a new button when the user clicks search
    $(document).on("click", ".search-button", addTeam);

    // when the user clicks a team button, pull in gifs from GIPHY using an API call
    $(document).on("click", ".team-button", displayGifs);

    $(".bottom-controls").hide();

    $(window).scroll(function() {
        if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
            $(".bottom-controls").fadeIn();
        } else {
            $(".bottom-controls").fadeOut();
        }
    });

    $(".top-button").on("click", function() {
        $('body,html').animate({
            scrollTop: 0
        }, 500);
    });

    // populate the initial buttons on the page
    displayTeamButtons();
});