

// function to fetch weather api with api key
var getWeatherReport = function (city) {



    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=56f40ee173de6ace1c476154245cb044")
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayData(data);
                    console.log(data);

                })
            }
            else {
                document.location.replace("./index.html");
            }

        })

}
//
var displayData = function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    //const { dt } = data.dt
    console.log(name, icon, description, temp, humidity, speed);
    document.querySelector(".city-name").innerHTML = "Weather in " + name;
    document.querySelector(".icon").src = "https://openweathermap.org/img/wn" + icon + ".png";
    document.querySelector(".temp").innerHTML = temp + "F";
    document.querySelector(".humidity").innerHTML = humidity + "%";
    document.querySelector(".wind").innerHTML = speed + "MPH";
}

// variable for user input
// variable for user input
var nameInputEl = document.querySelector("#cityname");
var userFormEl = document.querySelector("#user-form");


var searchHandler = function (event) {
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
userFormEl.addEventListener("submit", searchHandler);








