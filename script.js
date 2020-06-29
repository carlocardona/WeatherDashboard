let cityArray = [];
let cityInput = "";
const apiKey = "63f13896fa74becbbddd56518f8a530f";

$(document).ready(function () {
  cityArray = localStorage.getItem("cityArray").split(",");

  if (!cityArray) {
    cityArray = [];
  }

  makeButtons();
});

$("#searchButton").on("click", function (event) {
  event.preventDefault();

  let cityInput = $("#cityInput").val();
  cityArray.push(cityInput);

  localStorage.setItem("cityArray", cityArray);

  searchWeather(cityInput);
  makeButtons();
});

function searchWeather(cityName) {
  $("#cityDate").empty();
  $("#basicInfo").empty();

  console.log("CityName: " + cityName);
  let queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=" +
    apiKey;

  $.ajax({ url: queryURL, method: "GET" }).then(function (response) {
    console.log(response);
    // cityDate
    let cityDateDiv = $("<div class='col basicCity'>");

    let cityName = response.name;
    let pName = $("<p>").text(cityName);
    cityDateDiv.append(pName);

    /////

    const todayDate = new Date(1000 * response.dt);

    const date = new Date(todayDate);
    const dateTimeFormat = new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
    const [
      { value: month },
      ,
      { value: day },
      ,
      { value: year },
    ] = dateTimeFormat.formatToParts(date);

    let pDate = $("<p>").text(`${day}-${month}-${year}`);
    cityDateDiv.append(pDate);

    let currentIconCode = response.weather[0].icon;
    let currentIcon =
      "http://openweathermap.org/img/wn/" + currentIconCode + "@2x.png";
    let iconImg = $("<img>").attr("src", currentIcon);
    cityDateDiv.append(iconImg);

    console.log("citydateDiv: " + cityDateDiv);
    $("#cityDate").append(cityDateDiv);

    // basicInfo

    let basicInfoDiv = $("<div class='col infoBasic'>");

    const kelToCel = response.main.temp - 273.15;
    let temp = $("<p>").text("Temperature: " + kelToCel.toFixed(2) + " °C");
    basicInfoDiv.append(temp);

    let humidity = $("<p>").text("Humidity: " + response.main.humidity + "%");
    basicInfoDiv.append(humidity);

    let windSpeed = $("<p>").text("Wind Speed: " + response.wind.speed);
    basicInfoDiv.append(windSpeed);

    // UV Index
    let coordLat = response.coord.lat;
    let coordLon = response.coord.lon;

    const queryUVIndex =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      coordLat +
      "&lon=" +
      coordLon +
      "&appid=" +
      apiKey;

    $.ajax({ url: queryUVIndex, method: "GET" }).then(function (response) {
      let uvIndex = $("<p id='uvIndex'>").text(
        "UV Index: " + response.current.uvi
      );
      basicInfoDiv.append(uvIndex);

      $("#basicInfo").append(basicInfoDiv);
    });

    forecast(coordLat, coordLon);
  });

  // 5 Day forecast

  function forecast(coordLat, coordLon) {
    $("#dayOne").empty();
    $("#dayTwo").empty();
    $("#dayThree").empty();
    $("#dayFour").empty();
    $("#dayFive").empty();

    const queryForecast =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      coordLat +
      "&lon=" +
      coordLon +
      "&appid=" +
      apiKey;

    $.ajax({ url: queryForecast, method: "GET" }).then(function (response) {
      for (let x = 0; x < 6; x++) {
        let foreCastDiv = [
          "#dayOne",
          "#dayTwo",
          "#dayThree",
          "#dayFour",
          "#dayFive",
        ];

        let dayForeCast = $("<div class='col'>");

        /////

        const foreDate = new Date(1000 * response.daily[x].dt);

        const date = new Date(foreDate);
        const dateTimeFormat = new Intl.DateTimeFormat("en", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        });
        const [
          { value: month },
          ,
          { value: day },
          ,
          { value: year },
        ] = dateTimeFormat.formatToParts(date);

        let foreCastDate = $("<p>").text(`${day}-${month}-${year}`);
        dayForeCast.append(foreCastDate);

        /////

        let foreCastIcon = response.daily[x].weather[0].icon;
        let iconURL =
          "http://openweathermap.org/img/wn/" + foreCastIcon + "@2x.png";

        console.log(iconURL);

        let iconImg = $("<img>").attr("src", iconURL);
        dayForeCast.append(iconImg);

        const kelToCel = response.daily[x].temp.day - 273.15;
        let foreCastTemp = $("<p>").text(
          "Temp: " + kelToCel.toFixed(2) + " °C"
        );

        dayForeCast.append(foreCastTemp);

        let foreCastHumid = $("<p>").text(
          "Humidity: " + response.daily[x].humidity + "%"
        );
        dayForeCast.append(foreCastHumid);

        $(foreCastDiv[x]).append(dayForeCast);
      }
    });
  }
}

// Make Button

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

// function clickedButton() {
//   let clickedCity = $(this).attr("cityName");
//   searchWeather(clickedCity);
// }

// Previous Buttons to re-show information
$(document).on("click", ".cityButton", (e) =>
  searchWeather($(e.target).attr("cityName"))
);

makeButtons();
