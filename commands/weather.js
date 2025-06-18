const { Command } = require("commander");
require("dotenv").config();
const colors = require("chalk");
const chalk = new colors.Chalk();
const key = process.env.API_KEY;

const failed = (msg = "Error in fetching data") => {
  console.log(chalk.red(msg));
  process.exit(1);
};
const weather = new Command("weather")
  .description("Get weather status")
  .requiredOption("-c, --city <string...>", "City to fetch its weather.")
  .option(
    "-m, --mode <string...>",
    "What kind of weather to get lol",
    "current"
  )
  .action(async (options) => {
    const city = options.city[0];
    const mode = options.mode;
    // I also get the current weather when fetching the forecast
    // so I will fetch the forecast and give the user based on their mode
    const res = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}&days=5&aqi=no&alerts=no`
    );
    const data = await res.json();
    if (data.error) {
      failed(
        "Error in getting weather data\nPlease ensure that you entered correct information"
      );
    }
    if (mode == "current") {
      const to_print = [
        `Last Updated : ${chalk.yellow(data.current.last_updated)}`,
        `Current Temperature in Celesius : ${chalk.magenta(
          data.current.temp_c
        )}`,
        `Weather Condition : ${chalk.green(data.current.condition.text)}`,
        `Humidity : ${chalk.cyan(data.current.humidity)}`,
      ];
      to_print.map((txt) => {
        console.log("\n", txt);
      });
    }
    /* 
        date
        max-min temp in C
        rain chance
        UV
    */
    if (mode == "forecast") {
      const days = data.forecast.forecastday;
      // console.log(days)
      days.forEach((day) => {
        const dayData = day.day;
        const to_print = [
          `Date : ${chalk.yellow(day.date)}`,
          `Maximum Temperature : ${chalk.red(dayData.maxtemp_c)}`,
          `Minimum Temperature : ${chalk.blue(dayData.mintemp_c)}`,
          `Average Humidity : ${chalk.green(dayData.avghumidity)}`,
          `Chance of Rain : ${chalk.yellowBright(
            dayData.daily_chance_of_rain + "%"
          )}`,
          `UV : ${chalk.magenta(dayData.uv)}`,
        ];
        to_print.map((txt) => {
          console.log("\n", txt);
        });
        let hr = "";
        for (let i = 0; i < 30; i++) {
          hr = hr + "----";
        }
        console.log(hr);
      });
    }
  });

module.exports = weather;
