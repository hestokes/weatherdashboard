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
