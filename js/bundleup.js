

function getWeather(position) {
	var state = sGeobytesRegion;
	var city = sGeobytesCity;
	
	var temp = 0;

	$("#loc").append(city + ', ' + state);
	var url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "," + state;
	
	$.ajax( {
		type : "POST",
		dataType : "jsonp",
		url : url + "&callback=?",
		success : function(data) {
			temp = data['main']['temp'];
			ftemp = (9/5)*(temp - 273) + 32;
			ftemp = ftemp.toFixed(0);
			$("#temp").append(ftemp);

			wind = data['wind']['speed'];
			$("#wind").prepend(wind);
			gusts = data['wind']['gust'];
			$("#gusts").prepend(gusts);

			humidity = data['main']['humidity'];
			$("#humid").prepend(humidity);
			high = data['main']['temp_max'];
			fhigh = (9/5)*(high - 273) + 32;
			fhigh = fhigh.toFixed(0);
			$("#high").prepend(fhigh);
			low = data['main']['temp_min'];
			flow = (9/5)*(low - 273) + 32;
			flow = flow.toFixed(0);
			$("#low").prepend(flow);

			icon = data['weather'][0]['icon'];
			iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
			$("#weathericon").attr("src", iconurl);
			desc = data['weather'][0]['main'];
			$("#desc").append(desc);

			listsuggestions(ftemp);
		},
		error : function(errorData) {
			alert("Error while getting weather data :: " + errorData.status);
		}
	});
	$.ajax( {
		//5bb4e5428ca66275
		url : "http://api.wunderground.com/api/871d6fab2c5007d4/hourly/q/" + state + "/"+city+".json",
		dataType: "jsonp",
		success: function(parsed_json) {
			var hourly = parsed_json['hourly_forecast'];
			precip = hourly[0].pop;
			
			if (precip > 50) {
				setrain();
			}
			$("#precip").prepend(precip);
		},
		error: function() {
			$("#error").append("Problem with finding forecast.");
			$("#error").prop("hidden", false);
		}
	});
}

function getForecastHourly(timeOfDay) {
	var time;
	if (timeOfDay) {
	  switch (timeOfDay) {
	  	case 'Morning':
			time = 6;
		break;
		case 'Noon':
			time = 12;
		break;
		case 'Night': 
			time = 18;
		break; 
	  }
	}	
	
	$.ajax({
		url:"http://api.wunderground.com/api/5bb4e5428ca66275/hourly/q/"
		+state+"/"+city+".json",
		dataType:"jsonp",
		success: function(parsed_json) {
			var hourly = parsed_json['hourly_forecast'];
			for (var i = 0; i < hourly.length; i++) {
				if (hourly[i].FCTTIME.hour >= time) {
					var temp = hourly[i].temp.english;
					var wind_mph = hourly[i].wspd.english;
					var humidity = hourly[i].humidity;
					var precip = hourly[i].pop;
					$("#temp").append(temp_f);
					$("#wind").append(wind_mph);
					$("#humid").append(humidity);
					$("#precip").append(precip);
					break;
				}
			}
		},
		error: function() {
			$("#error").append("Problem with finding forecast.");
			$("#error").prop("hidden", false);
		}
	});
}

function findcondition(temp) {
	if (temp < 45) {
		return 'cold';}
	if (temp < 70) {
		return 'mild';}
	return 'warm';
}

function listsuggestions(temp) {
	console.log(temp);
	var condition = findcondition(temp);
	document.getElementById(condition).style.display='block';
}

function setrain() {
	document.getElementById('rain').style.display='block';
}

