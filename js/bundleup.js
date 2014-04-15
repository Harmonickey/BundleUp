
function getLocation(form) {
	var city = form.city.value;
	localStorage.setItem("city", city);
	var state = form.state.value;
	localStorage.setItem("state", state);
}

function getWeather() {
	var temp = 0;

	var city = localStorage.getItem("city");
	var state = localStorage.getItem("state");
	$("#loc").append(city + ', ' + state);
	var url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "," + state;
	
	$.ajax( {
		type : "POST",
		dataType : "jsonp",
		url : url + "&callback=?",
		async : false,
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

	var date = new Date();
	var time = date.getHours();

	$.ajax( {
		//5bb4e5428ca66275
		url : "http://api.wunderground.com/api/871d6fab2c5007d4/forecast/q/" + state + "/"+city+".json",
		dataType: "jsonp",
		success: function(parsed_json) {
			var precip = parsed_json['forecast']['txt_forecast']['forecastday'][((time < 17) ? 0 : 1)]['pop'];
			console.log(precip);
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

	return;
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

