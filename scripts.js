var movieApp = {};
movA = movieApp;
movA.api_key = "583095d59a6244694cf1ded79f6826a0";


movieApp.init = function() {
	movA.grabConfig();
	movA.getSessionId();
	$("body").on("change", "input[type=radio]", function(){
		var rating = $(this).val();
		var movieId = $(this).attr("id").split("-")[0].replace('movie', '');
		movieApp.ratingHandler(rating,movieId);
	}); //end listen for a click
}; //end movieApp.init


//This funcitonw ill go to the movie db api and get all the config data that we require. When it finishes, it will put the data it gets onto movieApp config. 
movA.grabConfig = function(){
	var configURL = "http://api.themoviedb.org/3/configuration";
	$.ajax(configURL, {
		type: "GET",
		dataType : "jsonp",
		data : {
			api_key : movA.api_key
		},
		success : function(config){
			movA.config = config;
			movA.grabTopRated();
		}
	}); //end config ajax

}; //end grabConfig method function

movA.grabTopRated = function() {
	var topRatedURL = "http://api.themoviedb.org/3/movie/top_rated";
	$.ajax(topRatedURL, {
		type : "GET",
		dataType : "jsonp",
		data : {
			api_key : movA.api_key
		},
		success : function(data){
			console.log(data)
			//run the displayMovies method to put them on the page
			movA.displayMovies(data.results);
		}
	});//end top rated ajax

}; //end grabTopRated function

movA.displayMovies = function(movies) {
	for (var i = 0; i <movies.length; i++){
		var title = $("<h2>").text(movies[i].title);
		var image = $('<img>').attr('src',movieApp.config.images.base_url + "w500" + movies[i].poster_path).addClass('movieImg');
		var overlay = $("<div>").addClass("overlay");
		var rating = $("fieldset.rateMovie")[0].outerHTML;
		var movieWrap = $("<div>").addClass("movie");
		rating = rating.replace(/star/g, 'movie'+movies[i].id+'-star');
		rating = rating.replace(/rating/g, "rating-"+movies[i].id);
		movieWrap.append(image);
		movieWrap.append(overlay);
		overlay.append(title,rating);
		$("body").append(movieWrap);
		


	};
}; //end displayMovies





movieApp.ratingHandler = function(rating,movieId) {
	$.ajax("http://api.themoviedb.org/3/movie/" + movieId + "/rating", {
		type : "POST",
		data : {
			api_key : movA.api_key,
			guest_session_id : movA.session_id,
			value : rating * 2
		},
		success : function(response) {
			if(response.status_code) {
				alert("Thanks for the vote");
			}
			else {
				alert(response.status_message);
			}
		}
	}); //end ajax
}; //end ratingHandler

movieApp.getSessionId = function() {
	$.ajax("http://api.themoviedb.org/3/"+ "authentication/guest_session/new", {
		data : {
			api_key : movA.api_key },
		type : "GET", 
		dataType : "jsonp",
		success : function(session) {
			//store the session id for later use
			movA.session_id = session.guest_session_id;
			console.log(session);
		} //end success
	});//end ajax
}; //endgetSessionId 


//document ready comes after the name space has been defined, as well as all the functions that will be called in the document ready. 

$(function(){
	//in here you can call the functions. 
	movieApp.init();

});//end doc ready

