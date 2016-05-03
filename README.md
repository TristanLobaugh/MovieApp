# Movie App

### Movie App using AJAX 

## Summary

#### A movie app that uses CSS, Bootstrap, Bootstraps Modals, jQuery, TypeAhead and Isotope plugins to make an api request from the users input. The user enters their request into the text box as a typeahead plugin assists the user request. The request is then sent to a movies database. The response from the database will populate the page and then allow the user to sort the poster images via the Isotope plugin.

### Author: Tristan Lobaugh 
+ Github - https://github.com/TristanLobaugh
+ Homepage - http://tristanlobaugh.com

## Demo

[Live Demo](http://tristanlobaugh.com/movieApp)

## Screenshots

### Main page:
![alt text](https://raw.githubusercontent.com/TristanLobaugh/movieApp/master/img/screen_shot.png)

### Sorted by Isotope:
![alt text](https://raw.githubusercontent.com/TristanLobaugh/movieApp/master/img/screen_shot2.png)


##Code Examples

### Main function to make getJson request and then create the HTML dynamically from the response that is returned
```
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
```

## To Do
Buggy on search becuase of asynchronous issues