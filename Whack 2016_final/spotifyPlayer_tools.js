console.log('Hello world')

var a2a_config = a2a_config || {};
a2a_config.linkname = "Request songs at Audiocracy!";
a2a_config.num_services = 4;
a2a_config.color_main = "333333";
a2a_config.color_border = "333333";
a2a_config.color_link_text = "333333";
a2a_config.color_link_text_hover = "333333";
a2a_config.color_bg = "f9e4a4";
a2a_config.color_arrow_hover = "fff";

jQuery.ajaxSettings.traditional = true; 
var host = 'http://developer.echonest.com/'
var apiKey = 'L50XAMNSV0FMRBGAH';

var embed = '<iframe src="https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:TRACKS" style="width:300px; height:520px;" frameborder="0" allowtransparency="true"></iframe>';

// var songSeedList = ['spotify:track:1GC1MIaRMW3kfVK9VyD5Ii','spotify:track:5CMjjywI0eZMixPeqNd75R','spotify:track:0lbPLoj61m0e7jPMdGF5yK', 'spotify:track:5vL0KBvhuuFbF8PZTBnSN7', 'spotify:track:0YIFZapcCNaTZMttpOsa2q'];
var localSongSeedList = [];
var curSub = '';
var curSubID = '';

function play() {
    // $.getScript("echonest_tools.js", addSeedsGuest(localSongSeedList));
    // $.getScript("echonest_tools.js", createSeedPlaylist(.4));
    for (i = 0; i < localSongSeedList.length; i++) {
        addSeedsGuest(localSongSeedList);
    }
    createSeedPlaylist(.5);
}

function searchForSongGuest() {
    curSub = $("#guestSubmit").val();
    artistFromInput = curSub.split(',')[1];
    artistFromInput = artistFromInput.trim();
    titleFromInput = curSub.split(',')[0];
    titleFromInput = titleFromInput.trim();
    var url = 'http://developer.echonest.com/api/v4/song/search?api_key=L50XAMNSV0FMRBGAH&callback=?';
    $.getJSON(url, {
        'format':'jsonp', 
        'bucket': ['id:spotify',
        'tracks'],
        'results': 1, 
        'artist': artistFromInput,
        'title': titleFromInput,
    }, 
        function(data) {
            var song = data.response.songs[0];
            var curSubID = song.tracks[0].foreign_id;
            localSongSeedList.push(curSubID);
    }
    );
    alert('Song Initialized. Press Play.')
}

function info(txt) {
    $("#info").text(txt);
}