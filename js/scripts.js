$(document).ready(function(){
	var imagePath;
	var newHTML = "";
	var baseURL = "https://api.themoviedb.org/3/";
	var apiKey = "?api_key=e9ddb24aed6d48c4342303aba5269e28";

	var nowPlaying = baseURL + "movie/now_playing" + apiKey;
	var configURL = baseURL + "configuration" + apiKey;

	$.getJSON(configURL, function(configData){
		imagePath = configData.images.base_url;
		console.log(imagePath);
		});

	$.getJSON(nowPlaying, function(movieData){
		var movieImage = movieData.results;
		$(movieData.results).each(function(){
			newHTML += "<div class='col-sm-3'><img src=" + imagePath + "w300" + this.poster_path + "'></div>"
		});

		$("#posters").html(newHTML);
	});


	








});














