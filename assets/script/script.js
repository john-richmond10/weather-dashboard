// Set global variables
let APIKey = "bf437bc10a56e37c36b7c3aa2d8799c5";

let searchHistoryEl = document.getElementById("search-history");
let userSearchEl = document.getElementById("user-search");
let currentWeathEl = document.getElementById("current-weather");
let forecastEl = document.getElementById("forecast");
let cityEl = document.getElementById("city-search");
let forecastContainerEl = document.getElementById("forecast-container");
let fiveEl = document.getElementById("five-day");
let clearSearchEl = document.getElementById("clear-search");
let currentCity = "";
let prevCities = '';
let city = cityEl.value.trim().toLowerCase();
let queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;


//search function
let search = function (event) {
    event.preventDefault();
    

    if (city) {
        getCurrentReport(city);
        // cityEl.value = "";
        // currentCity = "";

        let cityBtn = city;
        let cityBtnEl = document.createElement("button");
        cityBtnEl.innerHTML = cityBtn;
        cityBtnEl.addEventListener("click", function () {
            getReport(city)});
        cityBtnEl.setAttribute('id', 'city-' + city);
        $(cityBtnEl).addClass('btn');
        searchHistoryEl.appendChild(cityBtnEl);

        saveSearchHistory(city);
    } else {
        alert("Please enter a city");
    }
};

// city call
let getReport = function (city) {
    fetch(queryURL).then(function (response) {
        if(response.ok) {
            response.json().then(function (data) {
                currentCity = data.name;
                getCoord(data);
            })
        } else {
            alert("Error: " + response.statusText);
        }
    })
    .catch (function (error) {
        alert('Cannot connect to API');
    });
};

let getCoord = function (data) {
    let lat = data.coord.lat;
    let lon = data.coord.lon;
    getWeather(lat, lon);
};

let getWeather = function (lat, lon) {
    fetch(queryURL).then(function (response) {
        if(response.ok) {
            response.json().then(function (data) {
                displayWeather(data);
                displayForecast(data);
            })
        } else {
            alert("Error: " + response.statusText);
        }
    })
    .catch (function (error) {
        alert('Cannot connect to API');
    });
};

let displayWeather = function (data) {
    currentWeathEl.innerHTML = "";
    let currentCity = activeCity;
    let date = moment.unix(data.current.dt).format('1');
    let temp = data.current.temp;
    let humid = data.current.humidity;
    let wind = data.current.wind_speed;
    let uv = data.current.uvi;
    let icon = data.current.weather[0].icon;
    $(currentWeathEl).addClass('current-weth');

    let uvIndex = document.createElement('span');
    uvIndex.innerHTML = uv;

    if(uv < 3) {
        $(uvIndex).addClass('low');
    } else if (uv >= 3 && uv < 6) {
        $(uvIndex).addClass('moderate');
    } else if (uv >= 6) {
        $(uvIndex).addClass('high');
    };

    let weathIcon = document.createElement('img');
    weathIcon.setAttribute('srs', 'http://openweathermap.org/img/w/' + icon + '.png');

    let currentCityEl =  document.createElement('h2');
    currentCityEl.innerHTML = currentCity + " " + date;
    currentWeathEl.appendChild(currentCityEl);
    currentCityEl.appendChild(weathIcon);

    let currentTempEl = document.createElement('p');
    currentTempEl.innerHTML = "Temperature: " + temp + "°F";
    currentWeathEl.appendChild(currentTempEl);

    let currentHumidEl = document.createElement('p');
    currentHumidEl.innerHTML = "Humidity: " + humid + "%";
    currentWeathEl.appendChild(currentHumidEl);

    let currentWindEl = document.createElement('p');
    currentWindEl.innerHTML = "Wind Speed: " + wind + " MPH";
    currentWeathEl.appendChild(currentWindEl);

    let currentUvEl = document.createElement('p');
    currentUvEl.innerHTML = "UV Index: ";
    currentUvEl.appendChild(uvIndex);
    currentWeathEl.appendChild(currentUvEl);
};

let displayForecast = function (data) {
    $('#forecast-container').empty();
    fiveEl.innerHTML = "5-Day Forecast:";

    for (let i = 1; i < 6; i++ ) {
        let forecastBoxEl = document.createElement('div');
        $(forecastBoxEl).addClass('forecast-box');

        let date = moment.unix(data.daily[i].dt).format('1');
        let dateEl = document.createElement('h3');
        dateEl.innerHTML = date;
        forecastBoxEl.appendChild(dateEl);

        let forecastIcon = data.daily[i].weather[0].icon;
        let forecastIconEl = document.createElement('img');
        forecastIconEl.setAttribute('src', 'http://openweathermap.org/img/w/' + forecastIcon + '.png');
        forecastBoxEl.appendChild(forecastIconEl);

        let temp = data.daily[i].temp.day;
        let tempEl = document.createElement('p');
        tempEl.innerHTML = "Temp: " + temp + "°F";
        forecastBoxEl.appendChild(tempEl);

        let humid = data.daily[i].humidity;
        let humidEl = document.createElement('p');
        humidEl.innerHTML = "Humidity: " + humid + "%";
        forecastBoxEl.appendChild(humidEl);

        forecastContainerEl.appendChild(forecastBoxEl);
    };
};

function cityBtn (city) {
    let cityBtn = city;
    let cityBtnEl = document.createElement("button");
    cityBtnEl.innerHTML = cityBtn;
    cityBtnEl.addEventListener("click", function () {
        getReport(city)});
    cityBtnEl.setAttribute('id', 'city-' + city);
    $(cityBtnEl).addClass('btn');
    searchHistoryEl.appendChild(cityBtnEl);
}

function saveSearch(city) {
    let saveCity = city;
    prevCities.push(saveCity);
    localStorage.setItem('prevCities', JSON.stringify(prevCities));
};

function loadPrev() {
    prevCities = JSON.parse(localStorage.getItem('prevCities'));

    if (!prevCities) {
        prevCities = [];
    } else {
        for (let i=0; i < prevCities.length; i++) {
            let city = prevCities[i];
            cityBtn(city);
        };
    };
};

let clearHistory = function () {
    localStorage.removeItem('prevCities');
    document.location.reload()
};

userSearchEl.addEventListener('click', search);
loadPrev();

