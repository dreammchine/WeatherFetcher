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

function displayWeather(data, forecastData) {
    const cityName = data.name;
    const temperature = data.main.temp;
    const description = data.weather[0].description;

    let forecastTableHTML = '<h3>Five-Day Forecast:</h3><table><tr><th>Date</th><th>Temperature (°C)</th><th>Description</th></tr>';
    forecastData.forEach(forecast => {
        const forecastDate = new Date(forecast.dt * 1000);
        const forecastTemperature = forecast.main.temp;
        const forecastDescription = forecast.weather[0].description;

        forecastTableHTML += `
            <tr>
                <td>${forecastDate.toLocaleDateString()}</td>
                <td>${forecastTemperature}</td>
                <td>${forecastDescription}</td>
            </tr>
        `;
    });
    forecastTableHTML += '</table>';

    const weatherInfoHTML = `
        <h2>${cityName}</h2>
        <p>Temperature: ${temperature} °C</p>
        <p>Description: ${description}</p>
        ${forecastTableHTML}
    `;
    weatherInfoDiv.innerHTML = weatherInfoHTML;
}



// Fetch and display weather and forecast for the current city
function getWeather(city) {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            // Fetch five-day forecast data
            const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
            fetch(forecastURL)
                .then(response => response.json())
                .then(forecastData => {
                    // Extract forecast for each day (assuming forecastData.list is an array of forecast entries)
                    const dailyForecasts = [];
                    for (let i = 0; i < forecastData.list.length; i += 8) {
                        dailyForecasts.push(forecastData.list[i]);
                    }

                    displayWeather(data, dailyForecasts);
                })
                .catch(error => {
                    console.error('Error fetching forecast data:', error);
                    alert('Error fetching forecast data. Please try again.');
                });
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Error fetching weather data. Please try again.');
        });
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
