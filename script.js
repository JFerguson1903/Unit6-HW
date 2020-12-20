// Global variables assigned
var results = "";
var DateTime = luxon.DateTime;

function displaySearchHistory() {
    // Empties out the previous entries of HTML so there aren't duplicates when it reloads
    $(".list-group").empty();
    $("#searchAlert").empty();

    // Retreiving items from local storage and assigning it to a variable previousUserSearch
    var previousUserSearch = JSON.parse(localStorage.getItem("userLocationSearch"));
    // Looping through each previouseUserSearch index and appending a div for each
    for (var i = 0; i < previousUserSearch.length; i++) {
        var activeClass = "";
        // Item with index 0 will have an active class
        if (i === 0) {
            activeClass = 'active';
        }
        // Creates the div to append each item to
        $(".list-group").append(`<button type="button" class="${activeClass} list-group-item list-group-item-action" value="${i}">${previousUserSearch[i][0]}</button>`);
    }
}

function storeUserLocationSearch() {
    // Retreiving items from local storage and assigning it to a variable previousUserSearch
    var previousUserSearch = JSON.parse(localStorage.getItem("userLocationSearch"));
    if (previousUserSearch === null) {
        previousUserSearch = [];
    }
    // Puts newest search results at the 0 index for previousUserSearch var
    previousUserSearch.unshift(results);

    // Stores new data in local storage
    localStorage.setItem("userLocationSearch", JSON.stringify(previousUserSearch));
    // calls function 
    displaySearchHistory();
}

function loadActiveSearch() {
    // Empties out the previous entries of HTML so there aren't duplicates
    $("#searchAlert").empty();

    // Assigning a variable for userSearch
    var cityStateButton = $(".active").val();

    // Retreiving items from local storage and assigning it to a variable previousUserSearch
    var previousUserSearch = JSON.parse(localStorage.getItem("userLocationSearch"));

    // Assigning variables for items in the array from the seleced cityState
    var cityName = previousUserSearch[cityStateButton][0];
    var latitudeReturn = previousUserSearch[cityStateButton][1];
    var longitudeReturn = previousUserSearch[cityStateButton][2];

    // Constructing a URL to search Open Weather Map API for the Latitide and Longitude
    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitudeReturn + "&lon=" + longitudeReturn + "&units=imperial&appid=ae3e2e9bcf9bf274f436653d07f65b1c";

    // Performing our AJAX GET request
    $.ajax({
            url: queryURL,
            method: "GET"
        })
        // After the data comes back from the API
        .then(function(response) {
            console.log(response);

            // Emptying and then Appending data for seleceted city's current day information
            $(".displayedCity").empty().append(cityName);
            $(".currentDate").empty().append(DateTime.fromSeconds(response.current.dt).toFormat('(M/dd/yyyy)'));
            $(".currentIcon").empty().append(`<img class="weatherSymbol" src="http://openweathermap.org/img/wn/${response.current.weather[0].icon}@2x.png" />`);
            $(".temp").empty().append(response.current.temp);
            $(".humidity").empty().append(response.current.humidity);
            $(".windSpeed").empty().append(response.current.wind_speed);

            // If statement to assign correct badge for uvScale
            var uvScale = "";
            var currentUV = response.current.uvi;
            if (currentUV <= 2) {
                uvScale = 'bg-success';
            } else if (currentUV >= 6) {
                uvScale = 'bg-danger';
            } else {
                uvScale = 'bg-warning';
            }
            // Emptying and then Appending UV data
            $(".uvIndex").empty().append(`<span class="badge ${uvScale}">${currentUV}</span>`);

            // Emptying the five day forcast 
            $("#cityFiveDayForcast").empty();

            for (var i = 1; i <= 5; i++) {
                // Creates the div to append each item to
                $("#cityFiveDayForcast").append(
                    `<div class="col-xs-12 col-lg-6 col-xl mb-2">
                        <div class="card text-white bg-primary">
                            <div class="card-body">
                                <h5>${DateTime.fromSeconds(response.daily[i].dt).toFormat('M/dd/yyyy')}</h5>
                                <p><img class="weatherSymbol" src="http://openweathermap.org/img/wn/${response.daily[i].weather[0].icon}@2x.png" /></p>
                                <p>Temp: ${response.daily[i].temp.max} F&#176;</p>
                                <p>Humidity: ${response.daily[i].humidity}%</p>
                            </div>
                        </div>
                    </div>`);
            }
        })
        // If API fails, 
        .fail(function(failure) {
            console.log(failure.responseJSON.message);
        });
}

$(document).ready(function() {
    // calls functions
    displaySearchHistory();
    loadActiveSearch();
});

// Form submit
$("#cityForm").submit(function(e) {
    // Stopping default form submit
    e.preventDefault();

    // Empties out the previous entries of HTML so there aren't duplicates
    $("#searchAlert").empty();

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
            console.log(response);
            // Storing an array of results in the results variable
            results = [userSearch, response.coord.lat, response.coord.lon];
            // Append alert if a city was not entered
            if (userSearch === "") {
                $("#searchAlert").append(`<div class="alert alert-danger" role="alert">Please enter City</div>`);
            } else {
                // calls function
                storeUserLocationSearch();
                loadActiveSearch();
            }
        })
        // If API fails, append response message 
        .fail(function(failure) {
            $("#searchAlert").append(`<div class="alert alert-danger" role="alert">${failure.responseJSON.message}</div>`);
        });
});

// Event listener for button list-group-item
$(document.body).on('click', '.list-group-item', function() {

    // Removing the active class from previously selected cityState when a different cityStateButton is clicked
    $(".active").removeClass("active");

    // Add the active class to newly selected cityStateButton
    $(this).addClass("active");

    // run loadActiveSearch function
    loadActiveSearch();
});