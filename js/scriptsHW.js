$(document).ready(function(){
	var searchFor = "";
	var imagePath;
	var newHTML = "";
	var baseURL = "https://api.themoviedb.org/3/";
	var apiKey = "?api_key=e9ddb24aed6d48c4342303aba5269e28";
	var moviesToSearch = [];
	var arrayToSearch = [];
	var genreArray = [];
	var nowPlaying = baseURL + "movie/now_playing" + apiKey;
	var configURL = baseURL + "configuration" + apiKey;
	var searchURL;
	var selected;

	$.getJSON(configURL, function(configData){
		imagePath = configData.images.base_url;
		});

//Get GENRES
	var genreURl = baseURL + "genre/movie/list" + apiKey;
	$.getJSON(genreURl, function(genreResult){
		$(genreResult.genres).each(function(){
			var genreID = this.id;
			var genreName = this.name;
			genreArray[genreID] = genreName;
		});
	});

//BUILD ARRAY FOR TYPE AHEAD
	$("#searchInput").keyup(function(){
		searchFor = $("#searchInput").val();
		if(searchFor !== ""){
		selected = $("select option:selected").attr("value");
		$("#page-heading").html(selected);
		// CREATE A LOOP TO MAKE THE ARRAY LARGER
			for(var i = 1; i <= 5; i++){
				searchURL = baseURL + "search/" + selected + apiKey + "&query=" + encodeURI(searchFor) + "&page=" + i;
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
		}
	});

	$("#searchButton").click(function(){
		generateGenreButtons();
		selected = $("select option:selected").attr("value");
		searchFor = $("#searchInput").val();
		searchURL = baseURL + "search/" + selected + apiKey + "&query=" + encodeURI(searchFor) + "&page=1";
		$.getJSON(searchURL, function(movieData){
			$(movieData.results).each(function(){
				if(this.profile_path === null){
					newHTML += "<div class='" + findGenres(this) + "movie-poster col-sm-3 poster-item'>" + this.name + "</div>";
				}else if(this.poster_path === null && this.media_type == "tv"){
					newHTML += "<div class='" + findGenres(this) + "movie-poster col-sm-3 poster-item'>" + this.original_name + "</div>";
				}else if(this.poster_path === null && this.media_type == "movie"){
					newHTML += "<div class='" + findGenres(this) + "movie-poster col-sm-3 poster-item'>" + this.original_title + "</div>";
				}else	{
					if(this.media_type == "person" || selected == "person"){
						newHTML += "<div class='" + findGenres(this) + "movie-poster col-sm-3' data-toggle='modal' data-target='#myModal' poster-item><img src=" + imagePath + "w300" + this.profile_path + " class='launch-modal'></div>";
					}else{
						newHTML += "<div class='" + findGenres(this) + "movie-poster col-sm-3' data-toggle='modal' data-target='#myModal' poster-item><img src=" + imagePath + "w300" + this.poster_path + " class='launch-modal'></div>";
					}
				}
			});
			$("#poster-grid").html(newHTML);
			getIsotope();
			//Click listner to launch modal
			$(".launch-modal").click(function(){
				var currImage = ($(this)[0].src);
				$(".modal-body img")[0].src = currImage;
			});
		});
		//CLICK LISTENER FOR GENRE BUTTONS TO ACTIVATE ISOTOPE
		$("#genre-buttons .btn").click(function(){
			console.log(this.id);
			$("#poster-grid").isotope({filter: "." + this.id});		
		});
	});


	//TYPEAHEAD
	var substringMatcher = function(strs) {
	  return function findMatches(q, cb) {
	  var matches, substringRegex;
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

	//FUNCTIONS
	//Loads Isotope after all the images have loaded
	function getIsotope(){
		var theGrid = $("#poster-grid").imagesLoaded(function(){
	  		theGrid.isotope({
			    itemSelector: '.movie-poster',
		        layoutMode: 'fitRows'
			  });
			});
	}
	//Pull the list of genres from genreArray, genereates the genre buttons an adds them to the http
	function generateGenreButtons(){
		var genreHTML = '';
		for(i=0; i<genreArray.length; i++){
			if(genreArray[i] != undefined){
				genreHTML += '<input type="button" id="' + genreArray[i].replace(" ", "-") + '" class="btn btn-default" value="'+genreArray[i] + '">'
			}
		}
		$('#genre-buttons').html(genreHTML);
	}
	//Gets the genres for the indivdual selections and adds them to a list so they can be added to the class list when the hhtp gets created
	function findGenres(dataObject){
		var genreList = "";
		$(dataObject.genre_ids).each(function(){
			genreList += genreArray[this].replace(" ", "-") + " ";
		});
		return genreList;
	}
});

