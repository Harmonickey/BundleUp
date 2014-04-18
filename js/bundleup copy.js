var wind_chill = 0;
var rain = false;
var sunny = false;

var state = sGeobytesRegion;
var city = sGeobytesCity;

$(function(){
	$("#city_label").html(city + ", ");
	$("#state_label").html(state);
	getForecast();
});

function findcondition(windchilltemp) {
	if (windchilltemp < 45) {
		return 'cold';}
	if (windchilltemp < 70) {
		return 'mild';}
	return 'warm';
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
					var temp_f = hourly[i].temp.english;
					var icon_url = hourly[i].icon_url;
					var wind_mph = hourly[i].wspd.english;
					var wind_dir = hourly[i].wdir.dir;
					var precip = hourly[i].pop;
					$("#temp").append(temp_f);
					$("#wind_mph").append(wind_mph);
					$("#wind_dir").append(wind_dir);
                    $("#weather").attr("src", icon_url);
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

function getForecast() {
	var date = new Date();
	var time = date.getHours();
	
	$.ajax({
		url:"http://api.wunderground.com/api/5bb4e5428ca66275/forecast/q/"
		+state+"/"+city+".json",
		dataType:"jsonp",
		success: function(parsed_json) {
			var precip = parsed_json['forecast']['txt_forecast']['forecastday'][((time < 17) ? 0 : 1)]['pop'];
			if (precip > 50) {
				rain = true;
                        }
			$("#precip").append(precip);
		},
		error: function() {
			$("#error").append("Problem with finding forecast.");
			$("#error").prop("hidden", false);
		}
	});


	$.ajax({
		url:"http://api.wunderground.com/api/5bb4e5428ca66275/conditions/q/"
		+state+"/"+city+".json",
		dataType:"jsonp",
		success: function(parsed_json) {
                        var temp_f = parsed_json['current_observation']['temp_f'];
			var wind_dir = parsed_json['current_observation']['wind_dir'];
			var wind_mph = parsed_json['current_observation']['wind_mph'];
			wind_chill = parsed_json['current_observation']['windchill_f'];
                        var icon_url = parsed_json['current_observation']['icon_url'];
                        $("#temp").append(temp_f);
			$("#wind_mph").append(wind_mph);
			$("#wind_dir").append(wind_dir);
                        $("#weather").attr("src", icon_url);
		},
		error: function() {
			$("#error").append("Problem with finding current conditions.");
			$("#error").prop("hidden", false);
		}

	});	
}

function listsuggestions() {
	var condition = findcondition(wind_chill);
	document.getElementById(condition).style.display='block';
	if (rain==true) {
		document.getElementById('rain').style.display='block';
	}
}

function changeCityState() {
  city = $("#city");
  state = $("#state");
  getForecast();
}
