let cityArray = [];
let cityInput = '';

$("#searchButton").on("click", function (event) {
    event.preventDefault();

    let cityInput = $("#cityInput").val();
    cityArray.push(cityInput);
    console.log("cityinput: " + cityInput);
    searchWeather(cityInput);
    makeButtons();


});

function searchWeather(cityName) {
    // console.log("displaying weather, cityInput: " + cityInput);
    // cityName = $(this).attr("cityName");
    const apiKey = "63f13896fa74becbbddd56518f8a530f";
    console.log("CityName: " + cityName);
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName +
        "&appid=" + apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        //cityDate
        let cityDateDiv = $("<div class='col basicCity'>");

        let cityName = response.name;
        let pName = $("<p>").text(cityName);
        cityDateDiv.append(pName);

        let currentDate = response.dt;
        let pDate = $("<p>").text(currentDate);
        cityDateDiv.append(pDate);

        let currentIcon = response.weather.icon;
        let iconImg = $("<img>").attr("src", currentIcon);
        cityDateDiv.append(iconImg);

        console.log("citydateDiv: " + cityDateDiv);
        $("#cityDate").prepend(cityDateDiv);

        //basicInfo

        let basicInfoDiv = $("<div class='col infoBasic'>");

        const kelToCel = response.main.temp - 273.15;
        let temp = $("<p>").text(kelToCel.toFixed(2) + " C");
        basicInfoDiv.append(temp);

        let humidity = $("<p>").text("Humidity: " + response.main.humidity);
        basicInfoDiv.append(humidity);

        let windSpeed = $("<p>").text("Wind Speed: " + response.wind.speed);
        basicInfoDiv.append(windSpeed);

        //UV Index
        let coordLat = response.coord.lat;
        let coordLon = response.coord.lon;

        const queryUVIndex = "https://api.openweathermap.org/data/2.5/uvi?lat=" + coordLat + "&lon=" + coordLon + "&appid=" + apiKey;

        $.ajax({
            url: queryUVIndex,
            method: "GET"
        }).then(function (response) {

            let uvIndex = $("<p id='uvIndex'>").text("UV Index: " + response.value);
            basicInfoDiv.append(uvIndex);
        });

        $("#basicInfo").prepend(basicInfoDiv);

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

//Make Button

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
}

$(document).on("click", ".cityButton", searchWeather);
makeButtons();


