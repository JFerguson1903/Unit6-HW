// Constructing a URL to search Open Weather Map API for the Latitide and Longitude
// var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitudeReturn + "&lon=" + longitudeReturn + "&appid=ae3e2e9bcf9bf274f436653d07f65b1c";

// var latitudeReturn = "";

// var longitudeReturn = "";


// Event listener for btn-primary
$(".btn-primary").on("click", function() {
    // Assigning a variable for userSearch
    var userSearch = $("#userSearch").val();

    // Constructing a URL to search Open Weather Map API for the City,State
    var cityAPISearch = "https://api.openweathermap.org/data/2.5/weather?q=" + userSearch + ",US&appid=ae3e2e9bcf9bf274f436653d07f65b1c";

    // Performing our AJAX GET request
    $.ajax({
            url: cityAPISearch,
            method: "GET"
        })
        // After the data comes back from the API
        .then(function(response) {
            // Storing an array of results in the results variable
            var results = [userSearch, response.coord.lat, response.coord.lon];
            console.log(results);
        });
});