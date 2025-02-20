const API_KEY = '91a8b0d4c5d50d9617d0cce89862204e';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeatherUrlForCity = (city: string): string =>
  `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`;
