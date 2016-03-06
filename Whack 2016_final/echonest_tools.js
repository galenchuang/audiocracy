jQuery.ajaxSettings.traditional = true; 
var host = 'http://developer.echonest.com/'
var apiKey = 'L50XAMNSV0FMRBGAH';

var embed = '<iframe src="https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:TRACKS" style="width:640px; height:520px;" frameborder="0" allowtransparency="true"></iframe>';

// var songSeedList = ['spotify:track:1GC1MIaRMW3kfVK9VyD5Ii','spotify:track:5CMjjywI0eZMixPeqNd75R','spotify:track:0lbPLoj61m0e7jPMdGF5yK', 'spotify:track:5vL0KBvhuuFbF8PZTBnSN7', 'spotify:track:0YIFZapcCNaTZMttpOsa2q'];
var songSeedList = [];
var curSub = '';
var curSubID = '';

function addSeedsGuest(songIDs) {
    songSeedList = songSeedList.concat(songIDs);

}

function searchForSongHost() {
	curSub = $("#hostSubmit").val();
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
            songSeedList.push(curSubID);
	}
	);
}

function searchForSongGuest() {
	curSub = $("#guestSubmit").val();
	artistFromInput = curSub.split(',')[1];
	artistFromInput = artistFromInput.trim();
	titleFromInput = curSub.split(',')[0];
	titleFromInput = titleFromInput.trim();
	var url = 'http://developer.echonest.com/api/v4/song/search?api_key=L50XAMNSV0FMRBGAH&callback=?';
	// console.log(url);
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
            songSeedList.push(curSubID);
	}
	);
}


//create live playlist, song_id from user, focused = more clustered around seeds, variety 0-1, higher means more variety 
function createSeedPlaylist(variety) { 
    //hacky
    var temp =[];
    $.each(songSeedList, function(i, el){
        if($.inArray(el, temp) === -1) temp.push(el);
    });
    songSeedList = temp;

        // while (songSeedList.length > 5) {
        //     songSeedList = songSeedList.splice(4,3);
        // }
        console.log(songSeedList);
        // for (var i = 0; i < 20; i++) {
        //     if (songSeedList.length > 5) {
        //         console.log('here');
        //         songSeedList = songSeedList.splice(4,1);
        //         console.log('new: ' + songSeedList)
        //     }
        // }
    var url = 'http://developer.echonest.com/api/v4/playlist/static?api_key=' + apiKey + '&callback=?';
    $.getJSON(url, 
        { 
            'track_id': songSeedList, 'format':'jsonp', 
            'bucket': [ 'id:spotify', 
            'tracks'], 'limit' : true,
            'variety' : variety,
            'results': 10, 'type':'song-radio', 
        }, 
            function(data) {
                info("");
                $("#results").empty();
                if (! ('songs' in data.response)) {
                    info("Can't find that artist");
                } else {
                    $("#all_results").show();
                    var tracks = "";
                    for (var i = 0; i < data.response.songs.length; i++) {
                        var song = data.response.songs[i];
                        var tid = song.tracks[0].foreign_id.replace('spotify:track:', '');
                        tracks = tracks + tid + ',';
                    }
                    var tembed = embed.replace('TRACKS', tracks);
                    tembed = tembed.replace('PREFEREDTITLE' + ' playlist');
                    var li = $("<span>").html(tembed);
                    $("#results").append(li);
                }
            }
        );
}

function info(txt) {
    $("#info").text(txt);
}