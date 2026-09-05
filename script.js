const weatherForm = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");

const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const weatherCard = document.getElementById("weatherCard");

const cityName = document.getElementById("cityName");
const countryName = document.getElementById("countryName");

const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weatherDescription");
const weatherIcon = document.getElementById("weatherIcon");

const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const feelsLike = document.getElementById("feelsLike");
const weatherType = document.getElementById("weatherType");


// Form Submit
weatherForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const city = cityInput.value.trim();

    if (city === "") {
        showError("Please enter a city name.");
        return;
    }

    getWeather(city);
});


// Main Weather Function
async function getWeather(city) {

    showLoading();
    hideError();
    weatherCard.classList.add("hidden");

    try {

        // Step 1: Find city coordinates
        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Unable to find city.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Please check the city name.");
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // Step 2: Get weather
        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data.");
        }

        const weatherData = await weatherResponse.json();

        // Step 3: Display weather
        displayWeather(location, weatherData.current);

    } catch (error) {

        showError(error.message);

    } finally {

        hideLoading();

    }
}


// Display Weather
function displayWeather(location, weather) {

    cityName.textContent = location.name;

    countryName.textContent =
        `${location.admin1 || ""}, ${location.country || ""}`;

    temperature.textContent =
        Math.round(weather.temperature_2m);

    humidity.textContent =
        `${weather.relative_humidity_2m}%`;

    windSpeed.textContent =
        `${weather.wind_speed_10m} km/h`;

    feelsLike.textContent =
        `${Math.round(weather.apparent_temperature)}°C`;

    const weatherInfo =
        getWeatherDescription(weather.weather_code);

    weatherDescription.textContent =
        weatherInfo.description;

    weatherType.textContent =
        weatherInfo.type;

    weatherIcon.textContent =
        weatherInfo.icon;

    weatherCard.classList.remove("hidden");
}


// Weather Code Function
function getWeatherDescription(code) {

    if (code === 0) {
        return {
            description: "Clear Sky",
            type: "Clear",
            icon: "☀️"
        };
    }

    if (code === 1 || code === 2) {
        return {
            description: "Partly Cloudy",
            type: "Cloudy",
            icon: "🌤️"
        };
    }

    if (code === 3) {
        return {
            description: "Overcast",
            type: "Cloudy",
            icon: "☁️"
        };
    }

    if ([45, 48].includes(code)) {
        return {
            description: "Foggy",
            type: "Fog",
            icon: "🌫️"
        };
    }

    if ([51, 53, 55].includes(code)) {
        return {
            description: "Drizzle",
            type: "Drizzle",
            icon: "🌦️"
        };
    }

    if ([61, 63, 65].includes(code)) {
        return {
            description: "Rain",
            type: "Rainy",
            icon: "🌧️"
        };
    }

    if ([71, 73, 75].includes(code)) {
        return {
            description: "Snow",
            type: "Snowy",
            icon: "❄️"
        };
    }

    if ([80, 81, 82].includes(code)) {
        return {
            description: "Rain Showers",
            type: "Rainy",
            icon: "🌦️"
        };
    }

    if ([95, 96, 99].includes(code)) {
        return {
            description: "Thunderstorm",
            type: "Storm",
            icon: "⛈️"
        };
    }

    return {
        description: "Unknown Weather",
        type: "Unknown",
        icon: "🌡️"
    };
}


// Loading Functions
function showLoading() {
    loading.classList.remove("hidden");
}

function hideLoading() {
    loading.classList.add("hidden");
}


// Error Functions
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
}

function hideError() {
    errorMessage.classList.add("hidden");
}