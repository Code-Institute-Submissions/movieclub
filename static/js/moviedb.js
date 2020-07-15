$(document).ready(function () {

    if ( window.history.replaceState ) {
        window.history.replaceState( null, null, window.location.href );
    }

    $("#addcomment_formfill").click(function() {
        var x = document.getElementById("addcomment_form");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
        document.getElementById("movie_username").focus();
    })

    $("#addcategory_formfill").click(function() {
        var x = document.getElementById("addcategory_form");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
        document.getElementById("category_name").focus();
    })

    // Fixes for issue where new select options are not selectable
    // https://jsfiddle.net/KyleMit/1gxqhvpa/
    // initialize
    $('.materialSelect').formSelect();

    // setup listener for custom event to re-initialize on change
    $('.materialSelect').on('contentChanged', function() {
    $(this).formSelect();
    });

    function addmovieinfotoform(){

        //The movie information is retrieved from the selected item in the select element dropdown list in the addmovie html page
        var movietoaddtodb = document.getElementById("movielistoutput").value;

        //The track details are extracked from the track information and the track id is used in an api request to the musixmatch site
        var movie_name = movietoaddtodb.split('>')[0];
        movie_name = movie_name.trim()
        var movie_releasedate = movietoaddtodb.split('>')[1];
        movie_releasedate = movie_releasedate.trim()
        var movie_overview = movietoaddtodb.split('>')[2];
        movie_overview = movie_overview.trim()
        var add_movie_name = document.getElementById("movie_name")
        add_movie_name.value = movie_name;
        var add_movie_releasedate = document.getElementById("movie_releasedate")
        //movie_releasedate = movie_releasedate.substring(2);
        //movie_releasedate = movie_releasedate.replace(/-/g, "/");
        add_movie_releasedate.value = movie_releasedate;
        var add_movie_overview = document.getElementById("movie_overview")
        add_movie_overview.value = movie_overview;
        //Required to update the labels on the html page: Materialise documentation:
        //You can also call the function M.updateTextFields(); to reinitialize all the Materialize labels
        // on the page if you are dynamically adding inputs.
        M.updateTextFields();
    }

    //The getmovielist callback function contains the get request to the musixmatch song lyrics api website
    //It contains a callback to facilitate passing the output of the web request to the outputtracklisttohtml function
    function getmovielist(callback) {
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
    //The outputtracklist function run and it calls the getmovielist callback function to get the songs/tracks and return them to the readit html page

    $("#submitsearch").click(function outputmovielisttohtml() {

        //call the getmovielist function and pass the embedded function to the getmovielist function
        getmovielist(function(data) {
            
            //The tracklist is the following subset of the api request response JSON
            var movielist = data.results;
            console.log(data);

            //The select is used to facilitate the tracks being returned as a dropdown list in the readit html page
            var select = document.getElementById("movielistoutput");
            select.innerHTML = ""
            
            for(var i = 0; i < movielist.length; i++) {
                    var opt = data.results[i];
                    //Movie data is contatenated and returned to the dropdown list
                    var movie_title = opt.title;
                    var movie_releasedate = opt.release_date;
                    var movie_overview = opt.overview;
                    var trackinfo = movie_title + "     >" + movie_releasedate + "    >" + movie_overview;
                    //An element is created to contain the track details for each track returned to the readit html page
                    var el = document.createElement("option");
                    el.innerHTML = trackinfo;
                    //Once the data has been assembled it is returned to the html page by the new element being appended to the select element
                    select.appendChild(el);
                    //console.log(el);
                    //console.log(select);
                    $("#movielistoutput").trigger('contentChanged');
            }
    });
    }); 
        
    $("#addmovieinfotoform").click(addmovieinfotoform);

});