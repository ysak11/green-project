import ajax from './ajax';

//请求参数
const location = '113.549843,34.831152';
const key = '1db4458d4ab94d4f9a61bc8aeba32a53';

const url = "https://devapi.qweather.com/v7/weather/24h?lang=en&location=" + location + "&key=" + key + "&gzip=n";

export const nowWeather = () => ajax(url, {}, 'GET', false);

