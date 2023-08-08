const API_KEY = 'a38f0a2865ca21417d2e2d92786591a1';
const weatherInfoDiv = document.getElementById('weatherInfo');
const cityForm = document.getElementById('cityForm');
const cityInput = document.getElementById('cityInput');

// Add event listener to the form
cityForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const city = cityInput.value.trim();

    if (city === '') {
        alert('Please enter a valid city name.');
        return;
    }

    getWeather(city);
});

// Function to get weather by city name
function getWeather(city) {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Error fetching weather data. Please try again.');
        });
}

// Function to display weather information
function displayWeather(data) {
    const cityName = data.name;
    const temperature = data.main.temp;
    const description = data.weather[0].description;
    const weatherInfoHTML = `
        <h2>${cityName}</h2>
        <p>Temperature: ${temperature} °C</p>
        <p>Description: ${description}</p>
    `;

    weatherInfoDiv.innerHTML = weatherInfoHTML;
}

// Use geolocation to fetch user's current city
function getCityFromGeolocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
                .then(response => response.json())
                .then(data => {
                    const cityName = data.name;
                    cityInput.value = cityName; // Set the input value to the current city
                    getWeather(cityName); // Fetch and display weather for the current city
                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                    alert('Error fetching weather data. Please try again.');
                });
        });
    } else {
        alert('Geolocation is not available in this browser.');
    }
}

// Get the user's current city on page load
getCityFromGeolocation();
