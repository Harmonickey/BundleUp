$(function(){
	var state = "IL";
	var city = "Evanston";
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
			var p1 = parsed_json['forecast']['txt_forecast']['forecastday'][((time < 17) ? 0 : 1)]['pop'];
			var p2 = parsed_json['forecast']['txt_forecast']['forecastday'][((time < 17) ? 0 : 1)]['icon_url'];
		
			$("#precip").append(p1);
			$("#weather").attr("src", p2);
		},
		error: function() {
			$("#error").append("Problem with finding forecast.");
			$("#error").prop("hidden", false);
		}
	});
});