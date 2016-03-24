$(document).ready(function(){
	var searchFor = "";
	var imagePath;
	var newHTML = "";
	var baseURL = "https://api.themoviedb.org/3/";
	var apiKey = "?api_key=e9ddb24aed6d48c4342303aba5269e28";
	var moviesToSearch = [];
	var arrayToSearch = [];
	var matches = [];
	var nowPlaying = baseURL + "movie/now_playing" + apiKey;
	var configURL = baseURL + "configuration" + apiKey;
	var searchURL;
	var substringRegex;
	var selected;

	$.getJSON(configURL, function(configData){
		imagePath = configData.images.base_url;
		});

//BUILD ARRAY FOR TYPE AHEAD
	$("#searchInput").keyup(function(){
		searchFor = $("#searchInput").val();
		if(searchFor !== ""){
		selected = $("select option:selected").attr("value");
		$("#page-heading").html(selected);
			searchURL = baseURL + "search/" + selected + apiKey + "&query=" + searchFor;
			$.getJSON(searchURL, function(movieData){
				$(movieData.results).each(function(){
					if(selected === "movie"){
						arrayToSearch.push(this.original_title);
					}else{
					arrayToSearch.push(this.name);
					}
				});			
			});
		}
	});

	$("#searchButton").click(function(){
		searchFor = $("#searchInput").val();
		console.log(searchFor);
		searchURL = baseURL + "search/" + selected + apiKey + "&query=" + searchFor + "&page 1";
		$.getJSON(searchURL, function(movieData){
			console.log(movieData.results);
			$(movieData.results).each(function(){
				if(this.profile_path === null){
					newHTML += "<div class=' movie-poster col-sm-3'>" + this.name + "</div>";
				}else if(this.poster_path === null && this.media_type == "tv"){
					newHTML += "<div class=' movie-poster col-sm-3'>" + this.original_name + "</div>";
				}else if(this.poster_path === null && this.media_type == "movie"){
					newHTML += "<div class=' movie-poster col-sm-3'>" + this.original_title + "</div>";
				}else	{
					if(this.media_type == "person" || selected == "person"){
						newHTML += "<div class=' movie-poster col-sm-3'><img src=" + imagePath + "w300" + this.profile_path + "'></div>";
					}else{
						newHTML += "<div class=' movie-poster col-sm-3'><img src=" + imagePath + "w300" + this.poster_path + "'></div>";
					}
				}
			});

			$("#posters").html(newHTML);
		});
	});


//TYPEAHEAD

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
	  name: 'arrayToSearch',
	  source: substringMatcher(arrayToSearch)
	});

});
	
