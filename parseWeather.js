//const data = require('./data').data;
//console.log(data);
exports.parseWeather = function(response) {
	function WeatherAnalysis(forecast){
		return forecast.qpf + forecast.snow_qpf + forecast.wspd;
	}
	var weatherProcessed = [];
	for (i=0; i < 24; i++){
		//weatherProcessed[i]=WeatherAnalysis(response.forecasts[i]);
		weatherProcessed.push(WeatherAnalysis(response.forecasts[i]));
	}
	
	//console.log(JSON.stringify(weatherProcessed, null, 2));	
	return weatherProcessed;
}


//context.set("weather", weatherProcessed);