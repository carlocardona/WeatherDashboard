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
    $("#cityDate").empty();
    $("#basicInfo").empty();

    const apiKey = "63f13896fa74becbbddd56518f8a530f";
    console.log("CityName: " + cityName);
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName +
        "&appid=" + apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        console.log(response);
        //cityDate
        let cityDateDiv = $("<div class='col basicCity'>");

        let cityName = response.name;
        let pName = $("<p>").text(cityName);
        cityDateDiv.append(pName);

        let currentDate = response.dt;
        let d = new Date(currentDate);
        console.log("Date: " + d);
        let pDate = $("<p>").text(currentDate);
        cityDateDiv.append(pDate);

        let currentIcon = response.weather.icon;
        let iconImg = $("<img>").attr("src", currentIcon);
        cityDateDiv.append(iconImg);

        console.log("citydateDiv: " + cityDateDiv);
        $("#cityDate").append(cityDateDiv);

        //basicInfo

        let basicInfoDiv = $("<div class='col infoBasic'>");

        const kelToCel = response.main.temp - 273.15;
        let temp = $("<p>").text("Temperature: " + kelToCel.toFixed(2) + " C");
        basicInfoDiv.append(temp);

        let humidity = $("<p>").text("Humidity: " + response.main.humidity + "%");
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

        $("#basicInfo").append(basicInfoDiv);

        //5 Day Forecast
        let queryFiveForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey;

        $.ajax({
            url: queryFiveForecast,
            method: "GET"
        }).then(function (response) {

            for (let x = 0; x < 5; x++) {

                let foreCastDiv = ["#dayOne", "#dayTwo", "#dayThree", "#dayFour", "#dayFive"];

                console.log(response.list[x]);

                let dayForeCast = $("<div class='col'>");

                let foreCastDate = $("<p>").text("Date: " + response.list[x].dt_txt);
                dayForeCast.append(foreCastDate);

                let foreCastIcon = response.list[x].clouds;
                let iconImg = $("<img>").attr("src", foreCastIcon);
                dayForeCast.append(iconImg);

                const kelToCel = response.list[x].main.temp - 273.15;
                let foreCastTemp = $("<p>").text("Temp: " + kelToCel.toFixed(2) + " C");

                dayForeCast.append(foreCastTemp);

                let foreCastHumid = $("<p>").text("Humidity: " + response.list[x].main.humidity + "%");
                dayForeCast.append(foreCastHumid);

                $(foreCastDiv[x]).append(dayForeCast);

            }

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

//Previous Buttons to re-show information
$(document).on("click", ".cityButton", searchWeather);
makeButtons();


