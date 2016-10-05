var caps = function(word){
	return word.substr(0,1).toUpperCase() + word.substr(1);
}

var generateGenresList = function(genres){
	if(genres.length == 0){
		return "No genres listed in Spotify"
	}
	var genreList = "";
	for(var i = 0; i < genres.length; i++){
		var splitGenres = genres[i].split(" ");
		var currentGenre = [];
		for(var j = 0; j < splitGenres.length; j++){
			currentGenre[j] = caps(splitGenres[j]);
		}

		genreList = genreList + currentGenre.join(" ") +", ";
	}
	return genreList.substr(0, genreList.length-2);
}

var getRelatedArtists = function(id){
	console.log("called");
	$.get("http://api.spotify.com/v1/artists/"+id+"/related-artists").done(function(data){
		var allRelatedArtists = data.artists;
		var firstFive = allRelatedArtists.length < 5 ? allRelatedArtists : allRelatedArtists.slice(0, 5);
		var relatedArtistsHtml = '<li>Related Artists:<ul class="related-artists">';
		for(var i = 0; i < firstFive.length; i++){
			relatedArtistsHtml += ("<li><a href=search.html?artist="+firstFive[i].name.replace(/ /g, '+')+">"+firstFive[i].name+"</a></li>");
		}
		relatedArtistsHtml += "</ul></li>";
	$("#info-"+id).append(relatedArtistsHtml);
	});
}

var searchResults = function(){
	var searchParameter = $(location)[0].search.slice(8);
	$.get("http://api.spotify.com/v1/search", {q: searchParameter, type: 'artist', limit: '5'})
	.done(function(data){
		var searchData = data.artists.items;
		var artistCount = searchData.length < 5 ? searchData.length : 5;
		for(var i = 0; i < artistCount; i++){
			console.log(searchData[i]);
			var imageHtml = searchData[i].images.length == 0 ? "" : "<img class='artist-image' src="+searchData[i].images[0].url+">" 
			$(".search-results").append("<div class='row'><div class='col-md-4 col-md-offset-4'><div class='artist'><a data-toggle='collapse' href=#"+searchData[i].id+"><h3>"+searchData[i].name+"</h3>"
				+imageHtml+"</a></div></div>");
			$('.artist').one("click", getRelatedArtists(searchData[i].id));
			$(".search-results").append("<div class='row'><div class='col-md-4 col-md-offset-4'><div id="+searchData[i].id+" class='collapse'><br><ul class='artist-info' id='info-"+searchData[i].id+"'>"
				+"<li><iframe src='https://embed.spotify.com/?uri="+searchData[i].uri+"' width='300' height='80' frameborder='0' allowtransparency='true'></iframe></li>"
				+"<li>Genres:<br>"+ generateGenresList(searchData[i].genres)+"</li>"
				+"</ul></div></div></div><hr>")
		}
	});	 
}

$(document).ready(function(){
	searchResults();
});
