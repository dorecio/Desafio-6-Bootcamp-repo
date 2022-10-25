var APIKey = "cfdd7aba3e7159e0327b607a6adaf676";
var cityInputEl = document.querySelector("#cityname");
var searchBottonEl = document.querySelector("#search-botton");
//var cityFormEl = document.querySelector('city-form');
var searchHistoryEl = document.querySelector("#search-history");
var searchBottonEl = document.querySelector("#search-botton");
var searchHistoryEl = document.querySelector("#search-history");
var nameTodayEl = document.querySelector('#name-today');
var dateTodayEl = document.querySelector('#date-today');
var iconTodayEl = document.querySelector('#icon-today');
var todayInfoEl = document.querySelector('#today-info');
var pronosticoEl = document.querySelector('#days-container');
var todayInfoEl = document.querySelector('#today-info');
var localArray = [];

var start = function (event) {
    event.preventDefault();
    if (cityInputEl.value === '') {
        return;
    }
    var cityTemporal = cityInputEl.value.trim();
    var cityInput = cityTemporal.toUpperCase();
    if (localArray.indexOf(cityInput) === -1) {// Si no hay busqueda anteriormente de esta ciudad, la mete en el arreglo
        if (localArray.length === 8) {
            for (var j = 0; j < 7; j++) {
                var i = j + 1;
                localArray[j] = localArray[i];
            }
            localArray[j] = cityInput;
        } else {
            localArray.push(cityInput);
        }
    }
    setInLocalStorage();
    display(cityInput);
    cityInputEl.value = '';
}

function display(city) {
    consulta(city);
}

function despliega(data) {
    todayInfoEl.innerHTML = '';
    pronosticoEl.innerHTML = '';
    nameTodayEl.textContent = data.city.name;
    dateTodayEl.textContent = data.list[0].dt_txt;
    iconTodayEl.setAttribute('src', data.list[0].weather[0].icon);
    iconTodayEl.setAttribute('atl', 'icon weather');
    var temp = document.createElement('h3');
    temp.textContent = 'Temperature: ' + data.list[0].main.temp;
    var wind = document.createElement('h3');
    wind.textContent = 'Wind: ' + data.list[0].wind.speed;
    var humidity = document.createElement('h3');
    humidity.textContent = 'Humidity: ' + data.list[0].main.humidity;
    todayInfoEl.append(temp);
    todayInfoEl.append(wind);
    todayInfoEl.append(humidity);
    for (var i = 1; i < 6; i++) {
        var date = document.createElement('h4');
        date.textContent = data.list[i].dt_txt;
        var iconFuture = document.createElement('img');
        iconFuture.setAttribute('src', data.list[i].weather[0].icon);
        iconFuture.setAttribute('atl', 'icon weather');
        var tempFuture = document.createElement('h4');
        tempFuture.textContent = 'Temperature: ' + data.list[i].main.temp;
        var windFuture = document.createElement('h4');
        windFuture.textContent = 'Wind: ' + data.list[0].wind.speed;
        var humidityFuture = document.createElement('h4');
        humidityFuture.textContent = 'Humidity: ' + data.list[i].main.humidity;
        var container = document.createElement('div');
        container.appendChild(date);
        container.appendChild(iconFuture);
        container.appendChild(tempFuture);
        container.appendChild(windFuture);
        container.appendChild(humidityFuture);
        pronosticoEl.append(container);
    }
}

var consulta = function (ciudad) {
    var queryUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + ciudad + "&appid=" + APIKey + "&units=imperial";
    fetch(queryUrl)
        .then(function (response) {
            return response.json()
        }).then(function (data) {
            console.log(data);
            despliega(data);
        }).catch(function (error) {
            console.log(error);
        });
}

var setInLocalStorage = function () {
    localStorage.setItem('city', JSON.stringify(localArray));
    searchHistoryEl.innerHTML = '';
    if (localArray.length > 8) {
        localArray.length = 8;
    }
    crearBotones();
}

var crearBotones = function () {
    for (var i = 0; i < localArray.length; i++) {
        var btn = document.createElement('button');
        btn.textContent = localArray[i];
        btn.setAttribute('value', localArray[i]);
        var parametro = btn.textContent;
        btn.setAttribute('id','bottons');
        btn.addEventListener("click", function () { display(parametro) });
        searchHistoryEl.append(btn);
    }
}

var checarStorage = function () {
    var historial = localStorage.getItem('city');
    if (historial) {
        localArray = JSON.parse(historial);
    }
    if (localArray !== null) {
        crearBotones();
    }
}

checarStorage();
console.log('========> inicia');
searchBottonEl.addEventListener('click', start);
