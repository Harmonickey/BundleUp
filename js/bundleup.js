var rain = false;
var sunny = false;
var location;
var state;


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
	$("#loc").append('<-- ' + city + ', ' + state);
	var url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "," + state;
	
	$.ajax( {
		type : "POST",
		dataType : "json",
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
		},
		error : function(errorData) {
			alert("Error while getting weather data :: " + errorData.status);
		}
	});
	listsuggestions(temp);
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
	var condition = findcondition(temp);
	document.getElementById(condition).style.display='block';
	if (rain==true) {
		document.getElementById('rain').style.display='block';
	}
}



