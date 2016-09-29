var searchResults = function(){
	var searchData;
	var searchParameter = $(location)[0].search.slice(8);
	$.get("https://api.spotify.com/v1/search", {q: searchParameter, type: 'artist', limit: '5'})
	.done(function(data){
		searchData = data;
		console.log(data);
	});
	 
}
$(document).ready(searchResults());