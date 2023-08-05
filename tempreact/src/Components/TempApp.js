import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';
import "./Css/style.css";

const TempApp = () => {
  const [city, setCity] = useState("Mumbai");
  const [temperature, setTemperature] = useState('');
  const [country, setCountry] = useState('');
  const [weatherDescription, setWeatherDescription] = useState('');
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [timezoneOffset, setTimezoneOffset] = useState(0);

  const handleChange = (e) => {
    setCity(e.target.value);
  };

  useEffect(() => {
    if (city.trim() === '') {
      setTemperature('');
      setCountry('');
      setWeatherDescription('');
      setError('');
      return;
    }

    const fetchWeatherData = async () => {
      try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=bfa3f1964dbe4ae5a744044d41a4b065`;
        const weatherResponse = await fetch(weatherUrl);
        if (!weatherResponse.ok) {
          setError('Enter a valid city name');
          setTemperature('');
          setCountry('');
          setWeatherDescription('');
          return;
        }
        const weatherData = await weatherResponse.json();
        if (weatherData && weatherData.main && weatherData.main.temp) {
          // Convert temperature from Kelvin to Celsius
          const tempCelsius = weatherData.main.temp - 273.15;
          setTemperature(tempCelsius.toFixed(2)); // Set the temperature in Celsius
          setError('');

          // Use the country code received in the API response to get the country name
          const countryCode = weatherData.sys && weatherData.sys.country;
          setCountry(countryCode.toUpperCase()); // Set country in lowercase

          // Set the weather description
          if (weatherData.weather && weatherData.weather.length > 0) {
            setWeatherDescription(weatherData.weather[0].description);
          } else {
            setWeatherDescription('N/A');
          }

          // Get timezone offset for the selected city
          const timezoneOffsetInSeconds = weatherData.timezone;
          setTimezoneOffset(timezoneOffsetInSeconds);

          // Set the current time
          updateTimeWithTimezone(timezoneOffsetInSeconds);
        } else {
          setTemperature('N/A');
          setError('Data not available');
        }
      } catch (error) {
        console.error(error);
        setError('Error fetching data');
        setTemperature('N/A');
        setCountry('');
        setWeatherDescription('');
      }
    };

    const updateTimeWithTimezone = (timezoneOffsetInSeconds) => {
      const now = new Date();
      const localTime = now.getTime();
      const localOffsetInMilliseconds = now.getTimezoneOffset() * 60 * 1000;
      const cityOffsetInMilliseconds = timezoneOffsetInSeconds * 1000;
      const cityTime = new Date(localTime + cityOffsetInMilliseconds + localOffsetInMilliseconds);
      setCurrentTime(cityTime);
    };

    // Fetch weather data initially and whenever the city changes
    fetchWeatherData();

    // Update the current time every second
    const intervalId = setInterval(() => {
      updateTimeWithTimezone(timezoneOffset);
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [city, timezoneOffset]);

  const getFormattedDate = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const day = days[date.getDay()];
    const dayNumber = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    return `${day} ${dayNumber}${getOrdinalSuffix(dayNumber)} ${month}`;
  };

  const getOrdinalSuffix = (number) => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const relevantDigits = (number < 30) ? number % 20 : number % 30;
    const suffix = (relevantDigits <= 3) ? suffixes[relevantDigits] : suffixes[0];
    return suffix;
  };

  return (
    <div className="center-container">
      <Card className="text-center" style={{
          width: '100%',
          backgroundColor: 'rgb(242 211 206)',
        }}>
        <Card.Header>
          <FaGlobe style={{ marginRight: "10px", fontSize: "80px" }} />
        </Card.Header>
        <Card.Body>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Enter a city"
              aria-label="city"
              aria-describedby="basic-addon1"
              type="search"
              value={city}
              onChange={handleChange}
            />
          </InputGroup>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          {temperature && !error && (
            <div>
              <h3 style={{ fontSize: "50px" }}>
                <FaMapMarkerAlt style={{ marginRight: "5px" }} />
                {city.charAt(0).toUpperCase() + city.slice(1)}, {country.toUpperCase()}
              </h3>
              <div><h4 style={{ fontSize: "30px" }}>{weatherDescription}</h4></div>
              <div><h1 style={{ fontSize: "80px" }}>{temperature}°C</h1></div>
              <div><p style={{ fontSize: "20px" }}>{getFormattedDate(currentTime)}</p></div>
              <div><p style={{ fontSize: "20px" }}>Time: {currentTime.toLocaleTimeString()}</p></div>
            </div>
          )}
        </Card.Body>
        <Card.Footer className="text-muted">Created by Benazir</Card.Footer>
      </Card>
    </div>
  );
};

export default TempApp;
