var cityList = [];
var APIKey = "56f40ee173de6ace1c476154245cb044"

// function to fetch current weather 
var getWeatherReport = function (city) {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayTodayData(data);
                    console.log(data);
                    //create variables for lat and lon to to fetch UV index data
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

// function to fetch five day forecast and UV index data 
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

// function to display five day forecast
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

// Change UV index background
var dispalyUvIndex = function (jsonData) {
    var currentUVI = jsonData.current.uvi;
    document.querySelector(".uv-index").innerHTML = currentUVI;
    var indexEl = document.getElementById("index");

    if (currentUVI >= 0 && currentUVI < 3) {
        indexEl.classList.add("uv-favourable");
    } else if (currentUVI >= 3 && currentUVI < 7) {
        indexEl.classList.add("uv-moderate");
    } else if (currentUVI >= 7) {
        indexEl.classList.add("uv-severe");
    }
}

// Variable for user input
var userFormEl = document.querySelector("#user-form");

var formSubmitHandler = function (event) {
    var nameInputEl = document.querySelector("#cityname");
    event.preventDefault();

    // Get value from input element
    var cityname = nameInputEl.value.trim();

    if (cityname) {
        saveCity(cityname);
        getWeatherReport(cityname);
        nameInputEl.value = "";
        displaySavedCities();

    } else {
        alert("Please enter correct city Name");
    }
    console.log(event);
};

// Save unique city name
var saveCity = function (city) {
    cityList.push(city.toLowerCase())
    var uniqueSet = new Set(cityList)
    cityList = Array.from(uniqueSet)
    localStorage.setItem("cities", JSON.stringify(cityList));
}

var loadCities = function () {
    cityList = JSON.parse(localStorage.getItem("cities"))
    if (cityList == null) {
        cityList = [];
    }
    displaySavedCities()
}

// Display all saved cities for easy navigation
var displaySavedCities = function () {
    var citySearchedEl = document.getElementById("city-searched")
    citySearchedEl.innerHTML = null

    for (i = 0; i < cityList.length; i++) {
        const city = cityList[i];
        var listItem = document.createElement("li");

        var button = document.createElement("button")
        button.innerHTML = city
        button.addEventListener("click", function () {
            getWeatherReport(city)
        })
        button.style.width = "90%"
        button.style.padding = "10px"
        listItem.appendChild(button);
        listItem.style.margin = "10px"

        citySearchedEl.appendChild(listItem)
    }
}

userFormEl.addEventListener("submit", formSubmitHandler);

loadCities()