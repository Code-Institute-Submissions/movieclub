$(document).ready(function () {

    // Fixes for issue where new select options are not selectable
    // https://jsfiddle.net/KyleMit/1gxqhvpa/
    // initialize
    $('.materialSelect').formSelect();

    // setup listener for custom event to re-initialize on change
    $('.materialSelect').on('contentChanged', function() {
    $(this).formSelect();
    });

    function getlyrics(){

        //The track information is retrieved from the selected item in the select element dropdown list in the readit html page
        var newtrackid = document.getElementById("tracklistoutput").value;

        //The track details are extracked from the track information and the track id is used in an api request to the musixmatch site
        var track_name = newtrackid.split('>')[0];
        console.log(track_name)
        var artist_name = newtrackid.split('>')[1];
        console.log(artist_name)
        var album_name = newtrackid.split('>')[2];
        console.log(album_name)
        var newtrack = document.getElementById("movie_name")
        newtrack.innerHTML = track_name;
        newtrack.value = track_name;
        newtrack.text = track_name;
        //var newartist = document.getElementById("movie_category")
        //newartist.innerHTML = artist_name;
    
    }

    //The gettracklist callback function contains the get request to the musixmatch song lyrics api website
    //It contains a callback to facilitate passing the output of the web request to the outputtracklisttohtml function
    function gettracklist(callback) {
        "use strict";

        //Get the searchcriteria from the search input field in the readit html page
        var searchcriteria = document.getElementById("search").value;
        //var searchURL = "https://api.themoviedb.org/3/search/movie?api_key=c9226110f1db771f2745ac5085bb78f1&query=ad%20astra";
        var searchURL = "https://api.themoviedb.org/3/search/movie?api_key=c9226110f1db771f2745ac5085bb78f1&query=" + searchcriteria;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {     
            if (this.readyState === 4 && this.status === 200 && this.responseText !== null) {

                //JSON parse the text response from the musixmatch api
                var x = (JSON.parse(this.responseText));
                console.log(x);
                callback(x);
                }
            };
        xhr.open("GET", searchURL, true); 
        xhr.send();
    }

    //The following submitsearch event is activated when a user clicks on the Search button to search for a song/track on the readit html page
    //The outputtracklist function run and it calls the gettracklist callback function to get the songs/tracks and return them to the readit html page

    $("#submitsearch").click(function outputtracklisttohtml() {

        //call the gettracklist function and pass the embedded function to the gettracklist function
        gettracklist(function(data) {
            
            //The tracklist is the following subset of the api request response JSON
            var tracklistlength = data.results;
            console.log("output tracklist length");
            console.log(tracklistlength);
            console.log(tracklistlength.length);
            console.log("output tracklist");
            console.log(data);

            //The select is used to facilitate the tracks being returned as a dropdown list in the readit html page
            var select = document.getElementById("tracklistoutput");
            select.innerHTML = ""
            
            for(var i = 0; i < tracklistlength.length; i++) {
                    var opt = data.results[i];
                    //An element is created to contain the track details for each track returned to the readit html page
                    var el = document.createElement("option");
                    //A number of track fields are selected and contatenated to return to the dropdown list of tracks
                    var trname = opt.title;
                    var trid = opt.release_date;
                    var artist = opt.overview;
                    var trackinfo = trname + "     >" + artist + "    >" + trid;
                    //var trackinfo = trname + "     >" + trid;
                    console.log("trackinfo")
                    console.log(trackinfo)
                    el.innerHTML = trackinfo;
                    //Once the data has been assembled it is returned to the html page by the new element being appended to the select element
                    select.appendChild(el);
                    console.log(el);
                    console.log(select);
                    $("#tracklistoutput").trigger('contentChanged');
                    
            }
    });
    });
    

        $("#getlyrics").click(getlyrics);

});


