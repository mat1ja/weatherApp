# The weather app

This mobile application is developed using the Ionic framework with the Angular JavaScript framework. JavaScript code is written in TypeScript. For accessing weather data, I utilized the [Open weather map](https://openweathermap.org/) API. It is well-documented and straightforward to work with. Additionally, it offers 1200 free requests per day, but you need to create an account. If your application exceeds 1200 requests per day, the service will incur charges.
The application retrieves your location using the native functionality of your device. It then provides this location information to OpenWeatherMap to obtain weather data tailored to your current location.

To address the limit on the number of requests to the OpenWeatherMap server, I implemented a cache system. This system prevents the download of fresh weather data unless at least 15 minutes have passed since the last download or the user has moved a minimum of 500 meters from their previous location.

I've also implemented a reverse geocoding feature. It converts geographic coordinates into the name of the user's city, making it more human-readable. To implement this feature, I utilized the Google Maps Geocoding API.

## Screenshot

![Screenshot of current layout](/screenshot/screen2.png)
