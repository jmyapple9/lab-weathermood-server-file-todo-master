import axios from 'axios';

// TODO replace the key with yours
const key = '{YOUR API KEY}';

export function getWeatherGroup(code) {
  let group = 'na';
  if (200 <= code && code < 300) {
    group = 'thunderstorm';
  } else if (300 <= code && code < 400) {
    group = 'drizzle';
  } else if (500 <= code && code < 600) {
    group = 'rain';
  } else if (600 <= code && code < 700) {
    group = 'snow';
  } else if (700 <= code && code < 800) {
    group = 'atmosphere';
  } else if (800 === code) {
    group = 'clear';
  } else if (801 <= code && code < 900) {
    group = 'clouds';
  }
  return group;
}

export function capitalize(string) {
  return string.replace(/\b\w/g, (l) => l.toUpperCase());
}

const weatherBaseUrl = `http://api.openweathermap.org/data/2.5/weather?appid=${key}`;
let weatherSource = axios.CancelToken.source();

export function getWeather(city, unit) {
  var url = `${weatherBaseUrl}&q=${encodeURIComponent(city)}&units=${unit}`;

  console.log(`Making request to: ${url}`);

  return axios
    .get(url, { cancelToken: weatherSource.token })
    .then(function (res) {
      if (res.data.cod && res.data.message) throw new Error(res.data.message);

      return {
        city: capitalize(city),
        code: res.data.weather[0].id,
        group: getWeatherGroup(res.data.weather[0].id),
        description: res.data.weather[0].description,
        temp: res.data.main.temp,
        unit: unit,
      };
    })
    .catch(function (err) {
      if (axios.isCancel(err)) {
        console.error(err.message, err);
      } else {
        throw err;
      }
    });
}

export function cancelWeather() {
  weatherSource.cancel('Weather request canceled');
}

const forecastBaseUrl = `http://api.openweathermap.org/data/2.5/forecast?appid=${key}`;
let forecastSource = axios.CancelToken.source();

export function getForecast(city, unit) {
  var url = `${forecastBaseUrl}&q=${encodeURIComponent(city)}&units=${unit}`;
  console.log(`Making request to: ${url}`);

  return axios
    .get(url, { cancelToken: weatherSource.token })
    .then(function (res) {
      if (Number(res.data.cod) !== 200) {
        throw new Error(res.data.message);
      } else {
        return {
          city: capitalize(city),
          list: [
            // forecast 24 hours
            {
              ts: res.data.list[7].dt,
              code: res.data.list[7].weather[0].id,
              group: getWeatherGroup(res.data.list[7].weather[0].id),
              description: res.data.list[7].weather[0].description,
              temp: res.data.list[7].main.temp,
            },
            {
              ts: res.data.list[15].dt,
              code: res.data.list[15].weather[0].id,
              group: getWeatherGroup(res.data.list[15].weather[0].id),
              description: res.data.list[15].weather[0].description,
              temp: res.data.list[15].main.temp,
            },
            {
              ts: res.data.list[23].dt,
              code: res.data.list[23].weather[0].id,
              group: getWeatherGroup(res.data.list[23].weather[0].id),
              description: res.data.list[23].weather[0].description,
              temp: res.data.list[23].main.temp,
            },
            {
              ts: res.data.list[31].dt,
              code: res.data.list[31].weather[0].id,
              group: getWeatherGroup(res.data.list[31].weather[0].id),
              description: res.data.list[31].weather[0].description,
              temp: res.data.list[31].main.temp,
            },
            {
              ts: res.data.list[39].dt,
              code: res.data.list[39].weather[0].id,
              group: getWeatherGroup(res.data.list[39].weather[0].id),
              description: res.data.list[39].weather[0].description,
              temp: res.data.list[39].main.temp,
            },
          ],
          unit: unit,
        };
      }
    })
    .catch(function (err) {
      if (axios.isCancel(err)) {
        console.error(err.message, err);
      } else {
        throw err;
      }
    });
}

export function cancelForecast() {
  forecastSource.cancel('Forecast request canceled');
}
