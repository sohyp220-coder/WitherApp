// 1. جلب موقع المستخدم تلقائياً
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showWeather);
} else {
    alert("Geolocation is not supported by this browser.");
}

function showWeather(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const date = new Date();
    const day = date.toLocaleString('en-US', { weekday: 'long' });
    const day2 = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });

    const txt = document.createElement('div');
    document.body.appendChild(txt);

    const xhr = new XMLHttpRequest();
    // الرابط كما هو مع استخدام المتغيرات الجديدة للموقع
    xhr.open('GET', `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,apparent_temperature_max,apparent_temperature_min,sunrise,temperature_2m_max,temperature_2m_min,sunset,daylight_duration,sunshine_duration,uv_index_max,uv_index_clear_sky_max,rain_sum,snowfall_sum,precipitation_sum,showers_sum,precipitation_hours,precipitation_probability_max,wind_gusts_10m_max,wind_direction_10m_dominant,wind_speed_10m_max,shortwave_radiation_sum,et0_fao_evapotranspiration&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,dew_point_2m,rain,showers,snowfall,snow_depth,weather_code,pressure_msl,surface_pressure,cloud_cover,cloud_cover_low,cloud_cover_high,cloud_cover_mid,visibility,evapotranspiration,et0_fao_evapotranspiration,vapour_pressure_deficit,wind_speed_10m,wind_speed_120m,wind_speed_80m,wind_speed_180m,wind_direction_10m,wind_direction_80m,wind_direction_120m,wind_direction_180m,wind_gusts_10m,temperature_80m,temperature_120m,temperature_180m,soil_temperature_0cm,soil_temperature_18cm,soil_temperature_54cm,soil_temperature_6cm,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm,soil_moisture_9_to_27cm,soil_moisture_27_to_81cm&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,snowfall,weather_code,cloud_cover,showers,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=auto&past_days=1`, true);

    xhr.onload = function() {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            const temperatureNow = data.current.temperature_2m; 
            const ln = data.current.is_day; // true للنهار، false لليل
            const wind = (data.current.wind_speed_10m / 3.6).toFixed(1);
            const humidity = data.hourly.relative_humidity_2m[0];
            const rainP = data.daily.precipitation_probability_max[0];
            const rain = data.daily.rain_sum[0];
            const maxfuture = data.daily.temperature_2m_max;

            txt.innerHTML = `
                ${day}, ${day2} ${month}
                <h2 style='font-size: 50px;'>${temperatureNow}°</h2>
                <span> غداً ${day2+1}: ${maxfuture[1]}° </span>
                <h6 style='margin-top: 30px;'>
                    Humidity: ${humidity}% <br>
                    Rain Probability 🌧️: ${rainP}% <br>
                    Rain 💧: ${rain}mm <br>
                    Wind Speed 🌬: ${wind} m/s
                </h6>
            `;

            const i = document.querySelector('i');
            
            // ترتيب الشروط الصحيح:
            if (ln === 1 || ln === true) { 
                // حالة النهار
                if (temperatureNow > 25) {
                    i.className = 'fa fa-sun';
                } else if (temperatureNow >= 18) {
                    i.className = 'fa fa-cloud-sun';
                } else {
                    i.className = 'fa fa-cloud';
                }
            } else { 
                // حالة الليل
                i.className = 'fa fa-cloud-moon';
            }

            console.log("Current Temp:", temperatureNow, "Is Day:", ln);
        }
    };
    xhr.send();
}
