var availableCities = $("#city-list");
var cities = [];
var weatherApiKey = "349f59965f00cd94141bf5e009d70cd5";

function dayFormat(date) {
  var date = new Date();
  var month = date.getMonth() + 1;
  var day = date.getDate();

  var dayResult =
    date.getFullYear() +
    "/" +
    (month < 10 ? "0" : "") +
    month +
    "/" +
    (day < 10 ? "0" : "") +
    day;
  return dayResult;
}

startApp();

function startApp() {
  var savedCities = JSON.parse(localStorage.getItem("cities"));

  if (savedCities !== null) {
    cities = savedCities;
  }

  returnCities();
}

function saveCities() {
  localStorage.setItem("cities", JSON.stringify(cities));
}

//next enter Function renturnCities()

function returnCities() {
  availableCities.empty();

  for (var i = 0; i < cities.length; i++) {
    var city = cities[i];

    var listEl = $("<li>").text(city);
    listEl.attr("id", "listCi");
    listEl.attr("data-city", city);
    listEl.attr("class", "list-group-item");
    availableCities.prepend(listEl);
  }
  if (!city) {
    return;
  } else {
    getWeatherResponse(city);
  }
}

$("#add-city").on("click", function (event) {
  event.preventDefault();

  var city = $("#city-input").val().trim();

  if (city === "") {
    return;
  }

  cities.push(city);
  saveCities();
  returnCities();
});

function getWeatherResponse(cityName) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=" +
    weatherApiKey;

  $("#today-weather").empty();
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    cityTitle = $("<h3>").text(response.name + " " + dayFormat());
    $("#today-weather").append(cityTitle);
    var tempAsNumber = parseInt((response.main.temp * 9) / 5 - 459);
    var cityTemp = $("<p>").text("Temperature: " + tempAsNumber + " °F");
    $("#today-weather").append(cityTemp);
    var cityHumidity = $("<p>").text(
      "Humidity: " + response.main.humidity + " %"
    );
    $("#today-weather").append(cityHumidity);
    var cityWindSpeed = $("<p>").text(
      "Wind Speed: " + response.wind.speed + " MPH"
    );
    $("#today-weather").append(cityWindSpeed);
    var CoordLong = response.coord.lon;
    var CoordLat = response.coord.lat;

    //Api query for UV index
    var queryUvURL =
      "https://api.openweathermap.org/data/2.5/uvi?appid=" +
      weatherApiKey +
      "&lat=" +
      CoordLat +
      "&lon=" +
      CoordLong;
    $.ajax({
      url: queryUvURL,
      method: "GET",
    }).then(function (responseuv) {
      var cityUV = $("<span>").text(responseuv.value);
      var cityUVp = $("<p>").text("UV Index: ");
      cityUVp.append(cityUV);
      $("#today-weather").append(cityUVp);
      if (responseuv.value > 0 && responseuv.value <= 2) {
        cityUV.attr("class", "juneBud");
      } else if (responseuv.value > 2 && responseuv.value <= 5) {
        cityUV.attr("class", "lightGreenishBlue");
      } else if (responseuv.value > 5 && responseuv.value <= 7) {
        cityUV.attr("class", "shyMoment");
      } else if (responseuv.value > 7 && responseuv.value <= 10) {
        cityUV.attr("class", "turbo");
      } else {
        cityUV.attr("class", "pinkGlamour");
      }
    });

    //Api query for 5-day forecast
    var queryFiveDayURL =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      cityName +
      "&appid=" +
      weatherApiKey;
    $.ajax({
      url: queryFiveDayURL,
      method: "GET",
    }).then(function (response5day) {
      $("#boxes").empty();
      for (var i = 0, j = 0; j <= 5; i = i + 6) {
        var read_date = response5day.list[i].dt;
        if (response5day.list[i].dt != response5day.list[i + 1].dt) {
          var FivedayDiv = $("<div>");
          FivedayDiv.attr("class", "col-3 m-2 bg-primary");
          var d = new Date(0);
          d.setUTCSeconds(read_date);
          var date = d;
          var month = date.getMonth() + 1;
          var day = date.getDate();
          var dayOutput =
            date.getFullYear() +
            "/" +
            (month < 10 ? "0" : "") +
            month +
            "/" +
            (day < 10 ? "0" : "") +
            day;
          var Fivedayh4 = $("<h6>").text(dayOutput);

          var imgtag = $("<img>");
          var skyconditions = response5day.list[i].weather[0].main;
          if (skyconditions === "Clouds") {
            imgtag.attr(
              "src",
              "https://img.icons8.com/color/48/000000/cloud.png"
            );
          } else if (skyconditions === "Clear") {
            imgtag.attr(
              "src",
              "https://img.icons8.com/color/48/000000/summer.png"
            );
          } else if (skyconditions === "Rain") {
            imgtag.attr(
              "src",
              "https://img.icons8.com/color/48/000000/rain.png"
            );
          }

          var pElTemperatureK = response5day.list[i].main.temp;
          var temperatureAsNumber = parseInt((pElTemperatureK * 9) / 5 - 459);
          var pElTemperature = $("<p>").text(
            "Temperature: " + temperatureAsNumber + " °F"
          );
          var pElHumidity = $("<p>").text(
            "Humidity: " + response5day.list[i].main.humidity + " %"
          );
          FivedayDiv.append(Fivedayh4);
          FivedayDiv.append(imgtag);
          FivedayDiv.append(pElTemperature);
          FivedayDiv.append(pElHumidity);
          $("#boxes").append(FivedayDiv);
          j++;
        }
      }
    });
  });
}

$(document).on("click", "#listC", function () {
  var thisCity = $(this).attr("data-city");
  getWeatherResponse(thisCity);
});
