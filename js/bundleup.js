var wind_chill = 0;
var rain = false;
var sunny = false;

$(function(){
	
    $.ajax( {
		type: 'GET',
		url: "https://api.parse.com/1/classes/WeatherUpdate/BHlqXercLn",
		headers: {
				"X-Parse-Application-Id" : "O7uQwzz4oo6M9QfO8wrowXsQFl42DLltwCmuVpBS",
				"X-Parse-REST-API-Key": "ebM93An1KNTa5SrUmZXttv8mav1nrBSj6l2CMhVf"
		},
		dataType: 'json',
		success: function(ret) {
			
			var date = ret.updateAt;
			var weather = ret.weather;
			var location = ret.location;
			
			/*
			var date = new Date(ret.updateAt);
			var num_milli = date.getTime();
			
			var currentTime = new Date();
			var currentMilli = currentTime.getTime();
			*/
			
			if (/*more than 10 minutes */)
			{
				//call the api....	
				
				//then update info in parse
			}
			
		}
	});
	
	var state = "IL";
	var city = "Evanston";
        /*
	$.ajax({
		url:"http://api.wunderground.com/api/5bb4e5428ca66275/geolookup/conditions/q/"
		+state+"/"+city+".json",
		dataType:"jsonp",
		success: function(parsed_json) {
			var location = parsed_json['location']['city'];
			var temp_f = parsed_json['current_observation']['temp_f'];
			$("#temp").append(temp_f);
		},
		error: function() {
			$("#error").append("Problem with finding current condition.");
			$("#error").prop("hidden", false);
		}

	});

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
			wind_chill = parsed_json['current_observation']['feelslike_f'];
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
	*/
});

function updateParse(objectID) {
		 $.ajax( {
			type: 'PUT',
			url: "https://api.parse.com/1/classes/WeatherUpdate/" + objectID,
			headers: {
					"X-Parse-Application-Id" : "O7uQwzz4oo6M9QfO8wrowXsQFl42DLltwCmuVpBS",
					"X-Parse-REST-API-Key": "ebM93An1KNTa5SrUmZXttv8mav1nrBSj6l2CMhVf"
			},
			dataType: 'json',
			data: {
				weather: {
					temp: ,
					precip: ,
					wind: 
				},
				location: ?
				,
				
			}
			success: function(ret) {
				
			}
	});
}

function findcondition(windchilltemp) {
	if (windchilltemp < 45) {
		return 'cold';}
	if (windchilltemp < 70) {
		return 'mild';}
	return 'warm';
}

function listsuggestions() {
	var condition = findcondition(wind_chill);
	document.getElementById(condition).style.display='block';
	if (rain==true) {
		document.getElementById('rain').style.display='block';
	}
}
