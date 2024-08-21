const searchInput = document.querySelector(".search-input");
const currentWeatherDiv = document.querySelector(".current-weather");
const hourlyWeatherDiv = document.querySelector(".hourly-weather .weather-list"); 
const locationButton = document.querySelector(".location-button")

const API_KEY = "ff658400d5b748a7b5875032241308";

const displayHourlyForecast = (hourlyData) => {
    const currentHour = new Date().setMinutes(0, 0, 0);
    const next24Hour = currentHour + 24 * 60 * 60 * 1000;

    const next24HoursData = hourlyData.filter(({ time }) => {
        const forecastTime = new Date(time).getTime();
        return forecastTime >= currentHour && forecastTime <= next24Hour;
    });

    hourlyWeatherDiv.innerHTML = next24HoursData.map(item => {
        const temperature = Math.floor(item.temp_c);
        const time = item.time.split(" ")[1]; 
        const weatherIcon = Object.keys(weatherCodes).find(icon => weatherCodes[icon].includes(item.condition.code));

        return `<li class="weather-item">
            <p class="time">${time}</p>
            <img src="icons/${weatherIcon}.svg" alt="" class="weather-icon">
            <p class="temperature">${temperature}°</p>
        </li>`;
    }).join("");

   
    
};

const weatherCodes = {
    clear: [1000],
    clouds: [1003, 1006, 1009],
    mist: [1030, 1135, 1147],
    rain: [1063, 1150, 1153, 1168, 1171, 1180, 1183, 1198, 1201, 1240, 1243, 1246, 1273, 1276],
    moderate_heavy_rain: [1186, 1189, 1192, 1195, 1243, 1246],
    snow: [1066, 1069, 1072, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1122, 1125, 1237, 1249, 1252, 1255, 1258, 1261, 1264, 1279, 1282],
    thunder: [1087, 1279, 1282],
    thunder_rain: [1273, 1276],
};

const getWeatherDetails = async (API_URL) => {
    window.innerWidth <=768 && searchInput.blur()
    document.body.classList.remove("show-no-results")
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        const temperature = Math.floor(data.current.temp_c);
        const description = data.current.condition.text;
        const weatherIcon = Object.keys(weatherCodes).find(icon => weatherCodes[icon].includes(data.current.condition.code));

        currentWeatherDiv.querySelector(".temperature").innerHTML = `${temperature}<span>°</span>`;
        currentWeatherDiv.querySelector(".description").innerText = description;
        currentWeatherDiv.querySelector(".weather-icon").src = `icons/${weatherIcon}.svg`;

       
        const combinedHourlyData = data.forecast.forecastday[0].hour.concat(data.forecast.forecastday[1].hour);

        displayHourlyForecast(combinedHourlyData);

        searchInput.value=data.location.name;
        console.log(data);
    } catch (error) {
       document.body.classList.add("show-no-results")
    }
};

const setupWeatherRequest =(cityName)=>{
    const API_URL = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=2`;
        getWeatherDetails(API_URL)
}

searchInput.addEventListener("keyup", (e) => {
    const cityName = searchInput.value.trim();

    if (e.key === "Enter" && cityName) {
        setupWeatherRequest(cityName);
    }
});

locationButton.addEventListener("click",()=>{
    navigator.geolocation.getCurrentPosition(position=>{
        console.log(position)
        const {latitude ,longitude } =position.coords
        const API_URL = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${latitude}&days=2`;
        getWeatherDetails(API_URL)
    },error=>{
            alert("Location access denied. Please enable permission to use this feature.")
    })
})

setupWeatherRequest("london")