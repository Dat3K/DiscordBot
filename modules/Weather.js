const dotenv = require('dotenv');
const e = require('express');
const moment = require('moment-timezone');
moment.locale('vi');
dotenv.config();

module.exports = class Weather {
  constructor() {
    this.apiKey = process.env.WEATHER_API_KEY;
    this.city = 'Ho Chi Minh';
    this.date = moment().format('YYYY-MM-DD');
    this.data = {};
  }
  run = async () => {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${this.apiKey}&q=${this.city}&days=2&lang=vi`
      );
      this.data = await response.json();
    } catch (error) {
      console.error(error);
    }
  };
  // Change weather location
  changeLocation(city) {
    this.city = city;
  }

  getArlert() {
    const { alerts } = this.data;
    if (alerts) {
      const { title, description } = alerts;
      return { title, description };
    }
    return null;
  }

  getWeatherByDay(date = this.date) {
    const forecastday = this.data.forecast.forecastday;
    return forecastday.filter((forecast) => forecast.date == date)[0];
  }

  getDayDetail(date = this.date) {
    const weather = this.getWeatherByDay(date);
    const dayInfo = weather.day;
    const {
      maxtemp_c,
      mintemp_c,
      avgtemp_c,
      daily_chance_of_rain,
      condition,
      uv,
    } = dayInfo;

    return {
        maxtemp_c,
        mintemp_c,
        avgtemp_c,
        daily_chance_of_rain,
        condition,
        uv,
    };
  }

  getRainTime(date = this.date) {
    const weather = this.getWeatherByDay(date);
    const listHour = weather.hour;
    const listRainHour = listHour.filter((hour) => hour.chance_of_rain > 50);
    const rainHour = listRainHour.map((hour) => {
      return {
        time: hour.time,
        condition: hour.condition,
        chance_of_rain: hour.chance_of_rain,
        feelslike_c: hour.feelslike_c,
        uv: hour.uv,
      };
    });
    return rainHour;
  }
};
