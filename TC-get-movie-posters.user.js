// ==UserScript==
// @name		TC-get-movie-posters
// @include		https://tehconnection.eu/torrents.php*
// @grant		GM_xmlhttpRequest
// @require		https://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(function() {

    function pad(number, length) {

        var str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    }

    $('.group').each(function() {
        var group = $(this);
        var rating = $(this).find('.imdb-number-rating');
        var img = group.first().find('img').not('.bookmark').not('.heart');
        var imdbUrl;
        var url;

        var height = 260;
        var width = 180;

        var getJSON = function( url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open("get", url, true);
            xhr.responseType = "json";
            xhr.onload = function() {
                var status = xhr.status;
                if (status == 200) {
                    callback(null, xhr.response);
                    var t = (xhr.response);
                    url = t.Poster;
                    if (url =='N/A' || url.length===0)
                    {
                        url = 'https://s3.amazonaws.com/static.betaeasy.com/screenshot/456/456-25984-14192637741419263774.42.jpeg';
                    }
                    img.attr('src', url);
                    if (!imdbUrl)
                    {
                        imdbUrl = "https://www.imdb.com/title/" + t.imdbID + "/";
                    }
                    img.css( 'cursor', 'pointer' );
                    img.click(function(){
                        window.open(imdbUrl,'_blank');
                    });

                } else {
                    callback(status);
                }
            };
            xhr.send();

        };
        group.find('genre-icon').hide();

        if (rating.length)
        {
                imdbUrl = rating.find('a').attr('href');
            var imdbNumber_raw = imdbUrl.substr(imdbUrl.indexOf('/title/tt') + 9, imdbUrl.length);
            var imdbNumber = 'tt'+ pad(imdbNumber_raw, 7);
            url =  "https://www.omdbapi.com/?i=" + imdbNumber + "&plot=short&r=json";
        }
        else
        {
            var full_text = group.find('.torrent_title').find('a').text();
            var title = full_text.substr(0,full_text.length-4);
            var year = full_text.substr(title.length, full_text.length);

            /*Ni na bian ji dian (aka What Time Is It There?)*/
            if (full_text.indexOf('(aka ') > -1)
            {              
                title = title.substr(title.indexOf('(aka ') +5, title.length).replace(')','');
            }

         
            url = "https://www.omdbapi.com/?t=" + title.replace(' ', '+') + "&y=" + year +"&plot=short&r=json";
        }


        getJSON(url,
                function( err, data) {
            if (err !== null) {
                console.log("Something went wrong: " + err);
            }
        });

        group.find('genre-icon').css('height', height);
        group.find('genre-icon').css('width', width); 

        group.find('td.genre_icon img').css('height', height);
        group.find('td.genre_icon img').css('width', width); 
        group.find('td.genre_icon').css('max-width', width); 
        
        group.find('genre-icon').show();


    });
});