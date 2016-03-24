$(document).ready(function(){
	var searchFor;
	var imagePath;
	var newHTML = "";
	var baseURL = "https://api.themoviedb.org/3/";
	var apiKey = "?api_key=e9ddb24aed6d48c4342303aba5269e28";
	var moviesToSearch = [];
	var nowPlaying = baseURL + "movie/now_playing" + apiKey;
	var configURL = baseURL + "configuration" + apiKey;
	var movieSearchURL;
	var matches = [];
	var substringRegex;

	$.getJSON(configURL, function(configData){
		imagePath = configData.images.base_url;
		});

	$("#searchButton").click(function(){
		searchFor = $("#searchInput").val();
		console.log(searchFor);
		movieSearchURL = baseURL + "search/movie" + apiKey + "&query=" + searchFor + "&page 1";
		$.getJSON(movieSearchURL, function(movieData){
			var movieImage = movieData.results;
			$(movieData.results).each(function(){
				newHTML += "<div class=' movie-poster col-sm-3'><img src=" + imagePath + "w300" + this.poster_path + "'></div>"
			});

			$("#posters").html(newHTML);
		});
	});

	//CODE FOR GETTING TOP 20 MOVIES NOW PLAYING

	// $.getJSON(nowPlaying, function(movieData){
	// 	var movieImage = movieData.results;
	// 	$(movieData.results).each(function(){
	// 		newHTML += "<div class='col-sm-3'><img src=" + imagePath + "w300" + this.poster_path + "'></div>"
	// 	});

	// 	$("#posters").html(newHTML);
	// });

//TYPEAHEAD STUFF

	//ASSIGN TOP 20 movies to SEARCH ARRAY
	// $.getJSON(nowPlaying, function(movieData){
	// 	var movieImage = movieData.results;
	// 	$(movieData.results).each(function(){
	// 		moviesToSearch.push(this.original_title);
	// 	});
	// });

	var substringMatcher = function(strs) {
	  return function findMatches(q, cb) {
	   // var matches, substringRegex;

	    // an array that will be populated with substring matches
	    matches = [];

	    // regex used to determine if a string contains the substring `q`
	    substrRegex = new RegExp(q, 'i');

	    // iterate through the pool of strings and for any string that
	    // contains the substring `q`, add it to the `matches` array
	    $.each(strs, function(i, str) {
	      if (substrRegex.test(str)) {
	        matches.push(str);
	      }
	    });

	    cb(matches);
	  };
	};

	$('#search-bar .typeahead').typeahead({
	  hint: true,
	  highlight: true,
	  minLength: 1
	},
	{
	  name: 'moviesToSearch',
	  source: substringMatcher(moviesToSearch)
	});

});
	
