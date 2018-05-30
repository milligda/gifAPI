$(document).ready(function() {

    var apiKey = "2dMmU36VbyBnmg6m95JD1hqKqaAMppHE";
    var startQueryURL = "https://api.giphy.com/v1/gifs/search?q=";
    var offset = 0; // giphy uses offsets to determine the page.  25 items per page so page 2 would have an offset of 25, page 3 - 50
    var imagesLoaded = 24;

    // initial teams added ot the array
    var teams = ['miami heat', 'golden state warriors', 'cleveland cavaliers', 'boston celtics', 'los angeles lakers'];
    var team;

    // displays the buttons on the page
    function displayTeamButtons() {

        for (var i = 0; i < teams.length; i++) {
            
            // create the button element
            var button = $("<button>");

            // add the class and data attributes to the buttons
            button.addClass('team-button');
            button.attr('data-team', teams[i]);

            // set the text for the button
            button.text(teams[i]);

            // add the button to the correct container on the page
            button.appendTo('.team-buttons-container');
        }
    }

    // adds a team to the teams array and updates the buttons displayed on the page
    function addTeam(event) {
        
        event.preventDefault();

        // pull the search term from the input field and store it as a variable
        var searchTerm = $("#search-term").val().trim();

        // add the search term to the teams array
        teams.push(searchTerm);

        // empty the team-buttons-container 
        $('.team-buttons-container').empty();
    
        // repopulate it with the new array
        displayTeamButtons();

        // remove what the user input into the search field
        $("#search-term").val("");
    }

    // calls the Giphy API and populates the results in the gifs-container
    function displayGifs(event) {

        // the queryURL includes the starting URL block, the team, apiKey and offset number
        var queryURL = startQueryURL + team + "&api_key=" + apiKey + "&offset=" + offset;

        // ajax call to get the Gifs based on the queryURL
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function(response) {

            // store the array with the needed data
            var results = response.data;

            // for loop that runs based on the number of images set to load 
            for (var i = 0; i < imagesLoaded; i++) {
                
                // create a div for the gif and assign a class
                var gifTile = $("<div>");
                gifTile.addClass("gif-tile");

                // store the rating for the gif and set it in a <p> element
                var rating = results[i].rating;
                var p = $("<p>").text(rating);

                // create the image element for the gif
                var gifImage = $("<img>");

                // set the src for the gif to be a still image when the gifs are loaded
                gifImage.attr('src', results[i].images.fixed_width_still.url);

                // set the data-featherlight data value to the gif URL.  
                // Data-featherlight is required to use the featherlight lightbox package
                gifImage.attr('data-featherlight', results[i].images.downsized_medium.url);

                // append the image to the gif tile container
                gifImage.appendTo(gifTile);

                // append the rating to the gif tile container
                p.appendTo(gifTile);

                // append the gif tile to the gifs-container
                gifTile.appendTo(".gifs-container");
            }

            // when the gifs have been loaded, scroll the page down slightly to display the top row of the newest gifs
            window.scrollBy({
                top: 200, 
                left: 0, 
                behavior: 'smooth',
            });
        });
    }

    // add a new team to the Teams array and create a new button when the user clicks search
    $(document).on("click", ".search-button", addTeam);

    // event listener for when the user clicks a team button
    $(document).on("click", ".team-button", function() {

        // empty the gifs-container so that the container only includes gifs for the most recent team clicked
        $(".gifs-container").empty();

        // set the team based on the button's data attribute
        team = $(this).attr("data-team");

        // remove any spaces in the data variable
        team = team.replace(/ /g, "+");

        // run the displayGifs function
        displayGifs(); 
    });

    // on the page load, hide the bottom-controls container
    $(".bottom-controls").hide();

    // event listener to determine the user's place on the page
    $(window).scroll(function() {

        // if the user is near the bottom of the page, display the bottom-controls container
        // if the user is not near the bottom of the page, hide the bottom-controls container
        if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
            $(".bottom-controls").fadeIn();
        } else {
            $(".bottom-controls").fadeOut();
        }
    });

    // when the top-button is clicked, scroll to the top of the page
    $(".top-button").on("click", function() {
        $('body,html').animate({
            scrollTop: 0
        }, 500);
    });

    // on the load more button, increase the offset number and display the gifs on the page 
    $(document).on("click", ".load-button", function() {
        offset = offset + imagesLoaded;
        displayGifs();
    });

    // populate the initial buttons on the page when the page loads
    displayTeamButtons();

});