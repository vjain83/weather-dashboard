var city = "";
var APIKey = "56f40ee173de6ace1c476154245cb044"

// function to fetch current weather 
var getWeatherReport = function (city) {

    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayTodayData(data);
                    console.log(data);

                    var lat = data.coord.lat
                    var lon = data.coord.lon
                    getForecast(lat, lon)
                })
            }
            else {
                document.location.replace("./index.html");
            }
        })

}

// function for five day forecast
var getForecast = function (lat, lon) {
    fetch("http://api.openweathermap.org/data/2.5/onecall?exclude=hourly,alerts,minutely&lat="
        + lat + "&lon=" + lon + "&appid=" + APIKey + "&units=imperial")
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (jsonData) {
                    displayForecastData(jsonData);

                    dispalyUvIndex(jsonData);
                    console.log(jsonData);
                })
            }
            return null
        })
}

// function to display current data on top window
var displayTodayData = function (data) {

    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    console.log(name, icon, description, temp, humidity, speed);
    document.querySelector(".city-name").innerHTML = name + " (" + new Date(data.dt * 1000).toLocaleDateString() + ")";
    document.querySelector(".currentIcon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".temp").innerHTML = temp + " °F";
    document.querySelector(".humidity").innerHTML = humidity + " %";
    document.querySelector(".wind").innerHTML = speed + " MPH";

}

var displayForecastData = function (data) {

    for (var i = 1; i <= 5; i++) {
        var dayData = data.daily[i];
        console.log(dayData);
        document.getElementById("date" + i).innerHTML = new Date(dayData.dt * 1000).toLocaleDateString();
        document.getElementById("img" + i).src = "https://openweathermap.org/img/wn/" + dayData.weather[0].icon + ".png";
        document.querySelector(".temp" + i).innerHTML = "Temp: " + dayData.temp.day + " °F";
        document.querySelector(".humidity" + i).innerHTML = "Humidity: " + dayData.humidity + " %";
        document.querySelector(".wind" + i).innerHTML = "Wind: " + dayData.wind_speed + " MPH";

    }
}

var dispalyUvIndex = function (jsonData) {
    var currentUVI = jsonData.current.uvi;
    var element = document.querySelector("#index");
    document.querySelector(".uv-index").innerHTML = currentUVI;

}

// variable for user input
var nameInputEl = document.querySelector("#cityname");
var userFormEl = document.querySelector("#user-form");


var formSubmitHandler = function (event) {
    event.preventDefault();

    // get value from input element
    var cityname = nameInputEl.value.trim();

    if (cityname) {
        getWeatherReport(cityname);
        nameInputEl.value = "";
    } else {
        alert("Please enter correct city Name");
    }
    console.log(event);
};

userFormEl.addEventListener("submit", formSubmitHandler);








