var availableCities = $("#city-list");
var cities = [];
var weatherApiKey = "349f59965f00cd94141bf5e009d70cd5";

function dayFormat(date) {
  var date = new Date();
  console.log(date);
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
  console.log(localStorage);
}

//next enter Function renturnCities()

function returnCities() {
  cityList.empty();

  for (var i = 0; i < cities.length; i++) {
    var city = cities[i];

    var listEl = $("<li>").text(city.name);
    listEl.attr("id", "listCi");
    listEl.attr("data-city", city);
    listEl.attr("class", "list-group-item");
    console.log(listEl);
    cityList.prepend(listEl);
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

function getResponseWeather(cityName) {
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
    cityName = $("<h3>").text(response.name + " " + FormatDay());
    $("#today-weather").append(cityName);
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
    var queryURL2 =
      "https://api.openweathermap.org/data/2.5/uvi?appid=" +
      weatherApiKey +
      "&lat=" +
      CoordLat +
      "&lon=" +
      CoordLong;
    $.ajax({
      url: queryURL2,
      method: "GET",
    }).then(function (responseuv) {
      var cityUV = $("<span>").text(responseuv.value);
      var cityUVp = $("<p>").text("UV Index: ");
      cityUVp.append(cityUV);
      $("#today-weather").append(cityUVp);
      console.log(typeof responseuv.value);
      if (responseuv.value > 0 && responseuv.value <= 2) {
        cityUV.attr("class", "green");
      } else if (responseuv.value > 2 && responseuv.value <= 5) {
        cityUV.attr("class", "yellow");
      } else if (responseuv.value > 5 && responseuv.value <= 7) {
        cityUV.attr("class", "orange");
      } else if (responseuv.value > 7 && responseuv.value <= 10) {
        cityUV.attr("class", "red");
      } else {
        cityUV.attr("class", "purple");
      }
    });
