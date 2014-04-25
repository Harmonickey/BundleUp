
/*====Temperature Preferences====*/

var lowtemp = 45;
var hightemp = 75;
var pref = "default";

//ranges: <20, 20-50, >50
function setCold() {
	$("#right").removeClass("selected");
	$("#center").removeClass("selected");
	$("#left").addClass("selected");
	lowtemp = 20;
	hightemp = 50;
	pref = "cold";
}

//ranges: <45, 45-75, >75
function setWarm() {
	$("#left").removeClass("selected");
	$("#center").removeClass("selected");
	$("#right").addClass("selected");
	lowtemp = 45;
	hightemp = 75;
	pref = "warm";
}

//ranges: <35, 35-65, >65
function setDef() {
	$("#left").removeClass("selected");
	$("#right").removeClass("selected");
	$("#center").addClass("selected");
	lowtemp = 35;
	hightemp = 65;
	pref = "default";
}

function setPref() {
	var pref2 = localStorage.getItem("pref");
	if (pref2) {
		switch(pref2) {
			case "cold":
				setCold();
				break;
			case "warm":
				setWarm();
				break;
			default:
				setDef();
				break;
		}
	}
	else {
		setDef();
	}
}

function storePrefs() {
	localStorage.setItem("lowtemp", lowtemp);
	localStorage.setItem("hightemp", hightemp);
	localStorage.setItem("pref", pref);
	return true;
}



var err = 0;

function setErrors(err) {
	localStorage.setItem("err", err);
	console.log("Error set: " + err);
}

function loadErrors() {
	err = localStorage.getItem("err");
	console.log("Error retrieved: " + err);
	if(err==1) {
		console.log("Error: " + err);
		document.getElementById("error").style.display='block';
		localStorage.setItem("err", 0);
	}
}


function getLocation(form) {
	var city = form.city.value;
	localStorage.setItem("city", city);
	var state = form.state.value;
	localStorage.setItem("state", state);
	localStorage.setItem("lowtemp", lowtemp);
	localStorage.setItem("hightemp", hightemp);
	localStorage.setItem("pref", pref);

	var url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "," + state;
 	console.log(url);
 	$.ajax( {
 		type: 'POST',
 		url: url,
 		datatype: 'jsonp',
 		async: false,
 		success: function(data) {
 			if(data['message']) {
 					err = 1;
 					console.log("Failed location");
 					setErrors(err);
 					loadErrors();
 					localStorage.setItem("city", null);
 					localStorage.setItem("state", null);
 			}
 			else {
 					err = 0;
 					console.log("Success location");
 					setErrors(err);
 					document.location = "index.html";
 			}
 		}
 	});
}

function currentLocation(){
	console.log(localStorage.getItem("city"));
	if (localStorage.getItem("city") === null || localStorage.getItem("city") === "null") {
		if (navigator.geolocation){
			navigator.geolocation.getCurrentPosition(getWeather);
		}
		else{
			alert("Geolocation is not supported by this browser.");
	    }
	} else {
		getWeather(null, localStorage.getItem("city"), localStorage.getItem("state"));	
	}
}

function getWeather(position, city, state) {
	
	var city = city;
	var state = state;
	console.log(position)
	if (position != null) {
		var geoAPI = "http://api.wunderground.com/api/871d6fab2c5007d4/geolookup/q/"+ position.coords.latitude +","+ position.coords.longitude+".json";
		$.ajax ({
		  dataType : "jsonp",
		  url : geoAPI,
		  success : function(data) {
			console.log(data["location"])
			state = data['location']['state']
			console.log(state)
			city = data['location']['city']
			console.log(city)
			setWeather(city,state);
		  }
		});
	} else {
		setWeather(city,state);	
	}
}
function setWeather(city,state){
	var temp = 0;
/*
	var city = localStorage.getItem("city");
	var state = localStorage.getItem("state");
	*/

	$("#loc").prepend(city + ', ' + state);
	var url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "," + state;
	console.log(url);
	$.ajax( {
		type : "POST",
		dataType : "jsonp",
		url : url + "&callback=?",
		success : function(data) {
			if(data['message']) {
				err = 1;
				console.log("Failed location");
				setErrors(err);
				document.location = "location.html";
				localStorage.setItem("city", null);
				localStorage.setItem("state", null);
			}
			else {
				err = 0;
				console.log("Success location");
				setErrors(err);
			}
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

			code = data['weather'][0]['id'];

			if ([201, 202, 211, 212, 221, 231, 232].indexOf(code) > -1) {
				$("#alert_cond").append("Thunderstorms");
				document.getElementById("alert").style.display='block';
			}
			else if([502, 503, 504, 521, 522].indexOf(code) > -1) {
				$("#alert_cond").append("Heavy Rain");
				document.getElementById("alert").style.display='block';
			}
			else {
				switch(code) {
					case 602:
						$("#alert_cond").append("Heavy Snow");
						document.getElementById("alert").style.display='block';
						break;
					case 611:
						$("#alert_cond").append("Sleet");
						document.getElementById("alert").style.display='block';
						break;
					case 741:
						$("#alert_cond").append("Fog");
						document.getElementById("alert").style.display='block';
						break;
					case 900:
						$("#alert_cond").append("Tornado");
						document.getElementById("alert").style.display='block';
						break;
					case 901:
						$("#alert_cond").append("Tropical Storm");
						document.getElementById("alert").style.display='block';
						break;
					case 902:
						$("#alert_cond").append("Hurricane");
						document.getElementById("alert").style.display='block';
						break;
					case 903:
						$("#alert_cond").append("Extreme Cold");
						document.getElementById("alert").style.display='block';
						break;
					case 904:
						$("#alert_cond").append("Extreme Heat");
						document.getElementById("alert").style.display='block';
						break;
					case 905:
						$("#alert_cond").append("High Winds");
						document.getElementById("alert").style.display='block';
						break;
					case 906:
						$("#alert_cond").append("Hail");
						document.getElementById("alert").style.display='block';
						break;
					default:
						break;
				}
			}
			listsuggestions(ftemp);
		},
		error : function(errorData) {
			alert("Error while getting weather data :: " + errorData.status);
		}
	});

	function getUV(hourly) {
		var UVmax = 0;
		var i = 0;
		for(i=0; i<24; i++) {
			if(hourly[i].uvi > UVmax) {
				UVmax = hourly[i].uvi;
			}
		}
		return UVmax;
	}

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

			uvi = getUV(hourly);
			console.log(uvi);
			if (uvi > 5) {
				setSunglasses();
			}
			$("#uvi").prepend(uvi);

			feels_t = hourly[0].feelslike;
			$("#feels_t").prepend(feels_t);
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
	lowtemp = localStorage.getItem("lowtemp");
	hightemp = localStorage.getItem("hightemp");
	console.log(lowtemp);
	console.log(hightemp);
	if (temp < lowtemp) {
		return 'cold';}
	if (temp < hightemp) {
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

function setSunglasses() {
	document.getElementById('sunny').style.display='block';
}