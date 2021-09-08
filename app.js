const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

// https://api.openweathermap.org/data/2.5/weather?q=Moscow&appid=4e6424868e9019c3fc1a96a837807505
const key = "4e6424868e9019c3fc1a96a837807505";

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
    // requestWeather(res, "Moscow");
});

app.post("/" , (req, res) => {
    requestWeather(res, req.body.city);
});

function requestWeather(sender, city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`;
    https.get(url, (response) => {
        // string -> object: JSON.parse(string)
        // object -> string: JSON.stringify(object)
        response.on("data", (data) => {
            process.stdout.write(`\ndata:\n\n${data}\n`);
            const weatherData = JSON.parse(data);
            // for code 500 - light rain icon = "10d": http://openweathermap.org/img/wn/10d@2x.png
            const icon = weatherData.weather[0].icon;
            const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
            sender.write(`<h1>Weather in ${city}</h1>`);
            sender.write(`<p>The weather is "${weatherData.weather[0].description}"</p>`);
            sender.write(`<p>The temperature is ${weatherData.main.temp}</p>`);
            sender.write(`<img src="${imageURL}" alt="значок погоды">`);
            sender.send();
        });
    });
}

var portNumber = process.env.PORT || 3000;
app.listen(portNumber, () => {
    console.log("Server is running on port " + portNumber);
});
