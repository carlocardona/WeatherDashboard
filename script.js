let cityArray = [];
let cityInput = '';

$("#searchButton").on("click", function (event) {
    console.log("Searching...");
    event.preventDefault();

    let cityInput = $("#cityInput").val();
    cityArray.push(cityInput);
    makeButtons();

});

function makeButtons() {
    console.log("making button...");
    $(".resultList").empty();

    for (let i = 0; i < cityArray.length; i++) {
        const btnTag = $("<button>");
        btnTag.addClass("cityButton");
        btnTag.attr("cityName", cityArray[i]);
        btnTag.text(cityArray[i]);
        $(".resultList").append(btnTag);
    }

    //searchWeather(cityInput);

}

function searchWeather() {
    console.log("displaying weather, cityInput: " + cityInput);
    cityName = $(this).attr("cityName");
    const apiKey = "63f13896fa74becbbddd56518f8a530f";
    console.log("CityName: " + cityName);
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName +
        "&appid=" + apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        console.log(response);

        $("#cityName").text(response.name);
        $("#currentDate").text(response.dt);
        $("#currentIcon").text(response.weather.icon);

        const kelToCel = response.main.temp - 273.15
        $("#temperature").text("Temperature: " + kelToCel.toFixed(2) + " C");
        $("#humidity").text("Humidity: " + response.main.humidity);
        $("#windSpeed").text("Wind Speed: " + response.wind.speed)

        //UV Index
        let coordLat = response.coord.lat;
        let coordLon = response.coord.lon;

        const queryUVIndex = "https://api.openweathermap.org/data/2.5/uvi?lat=" + coordLat + "&lon=" + coordLon + "&appid=" + apiKey;

        $.ajax({
            url: queryUVIndex,
            method: "GET"
        }).then(function (response) {
            $("#uvIndex").text("UV Index: " + response.value);
        });

        //5 Day Forecast
        let queryFiveForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey;

        $.ajax({
            url: queryFiveForecast,
            method: "GET"
        }).then(function (response) {
            console.log("Forecast:" + JSON.stringify(response.list.dt));

        })

    });

};

$(document).on("click", ".cityButton", searchWeather);

makeButtons();