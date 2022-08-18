var randomElement;
var init_seconds = 1;
var endpoint = 'https://song-guess2.herokuapp.com';
// var endpoint = 'http://localhost:30850'
var difficult = 0;

SONGS = [];
SONGS_SELECTED = [];
artistName = '';

random = false;

GENRES = ["acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime", "black-metal", "blues", "bossanova", "brazil", "breakbeat", "british", "cantopop", "chicago-house", "children", "chill", "classical", "club", "comedy", "country", "dance", "dancehall", "death-metal", "deep-house", "disco",
    "dubstep", "edm", "electro", "electronic", "emo", "folk", "forro", "french", "funk", "garage", "german", "gospel", "goth", "grindcore", "groove", "grunge", "guitar", "happy", "hard-rock", "hardcore",
    "hardstyle", "heavy-metal", "hip-hop", "house", "idm", "indian", "indie", "indie-pop", "industrial", "iranian", "j-dance", "j-idol", "j-pop", "j-rock", "jazz", "k-pop", "kids", "latin", "latino", "malay", "mandopop", "metal", "metal-misc", "metalcore", "mpb", "new-age", "new-release",
    "opera", "pagode", "party","pop", "pop-film","power-pop", "progressive-house", "psych-rock", "punk", "punk-rock", "r-n-b", "rainy-day", "reggae", "reggaeton", "road-trip", "rock", "rock-n-roll", "rockabilly", "romance", "sad", "salsa", "samba",
    "sertanejo", "show-tunes", "singer-songwriter", "ska" , "sleep", "songwriter", "soul", "soundtracks", "spanish", "study", "summer", "swedish", "synth-pop", "tango", "techno", "trance", "trip-hop", "turkish", "work-out", "world-music"]

$(function () {


    shuffledGENRE = GENRES.sort(() => 0.5 - Math.random());

    shuffledGENRE.forEach(genre => {
        $("#genres").append(`<div class='bg-grey select-genre' data-genre='${genre}'><a>${genre.slice(0, 1).toUpperCase() + genre.slice(1).replace('-',' ')}</a></div>`)
    });

    $('#genres').owlCarousel({
        margin: 10,
        loop: true,
        autoWidth: true,
        items: 4
    })

    $.ajax({
        url: endpoint + '/code',
        method: 'get',
        dataType: 'json',
        beforeSend: function () {
        },
        success: function (response) {
        }
    })

    var LOADING = $("#loading");
    var dificult_select = $("#difficult_select");
    var DIFF_SELECT = $('#dificultSelect');
    var GAME = $("#game");
    var SELECT_ARTIST = $('#selectMenu');
    $('.owl-carousel').owlCarousel();

    /* TELA DE ESCOLHER O ARTISTA  */
    $('#selectArtists').on('input', async function () {
        var search = $('#selectArtists').val();
        $.ajax({
            url: endpoint + '/search/artists?q=' + encodeURI(search),
            method: 'get',
            dataType: 'json',
            beforeSend: function () {
            },
            success: function (response) {
                $('#artists').trigger("destroy.owl.carousel");
                $('#artists').empty();

                response.forEach(artist => {
                    $('#artists').append(`

                            <div class="ml-2 text-center" style=" cursor: pointer">
                                <a class="select-artist" data-id="${artist.id}" data-name="${artist.name}" >
                                 <img src="${artist.images[1].url}">
                                 <h4 class="text-default">${artist.name}</h4>
                                </a>
                            </div>`)
                })
                $('#artists').owlCarousel();
            }
        })
    })

    $(document).on('click', '.select-artist', function () {
        DIFF_SELECT.show(300);
        SELECT_ARTIST.hide(300);
        getSongsByArtist($(this).data('id'))
        artistName = $(this).data('name');
        $('#artist_title').text(artistName);
    })

    $(document).on('click', '.select-genre', function () {
        random = true;
        DIFF_SELECT.show(300);
        SELECT_ARTIST.hide(300);
        genre = $(this).data('genre');
        getSongsByGenre(genre);
        $('#artist_title').text(genre.slice(0, 1).toUpperCase() + genre.slice(1));
    })

    async function getSongsByArtist(artist) {
        $.ajax({
            url: endpoint + '/albums?q=' + encodeURI(artist),
            method: 'get',
            dataType: 'json',
            beforeSend: function () {
                dificult_select.hide();
                LOADING.show(300);
            },
            success: function (response) {
                dificult_select.show(300);
                LOADING.hide(300);
                SONGS = response;
            }
        });
    }

    async function getSongsByGenre(genre) {
        $.ajax({
            url: endpoint + '/random?q=' + encodeURI(genre),
            method: 'get',
            dataType: 'json',
            beforeSend: function () {
                dificult_select.hide();
                LOADING.show(300);
            },
            success: function (response) {
                dificult_select.show(300);
                LOADING.hide(300);
                SONGS = response;
            }
        });
    }

    /*  TElA DE ESCOLHER QUANTIDADE DE MUSICA*/
    $('.start-game').on('click', function () {
        difficult = parseInt($(this).text())
        setSongs();
    })

    async function setSongs() {
        const shuffled = SONGS.sort(() => 0.5 - Math.random());
        let selected = shuffled.slice(0, difficult);


        SONGS_SELECTED = selected.map(select => {
            return {
                artist: select.artist,
                previewUrl: select.previewUrl,
                song: select.song,
                played: false,
                win: false,
                seconds: 0,
            }
        })
        startGame();
    }

    async function startGame() {
        DIFF_SELECT.hide(300);
        GAME.show(300);
        setMusic(SONGS_SELECTED[difficult - 1])
    }

    async function nextSong() {
        difficult--;
        setMusic(SONGS_SELECTED[difficult - 1])
    }


    $('#moreSeconds').on('click', function () {
        init_seconds++;
        $("#jquery_jplayer_1").jPlayer('play');
    })

    $(document).on('click', '.guess-song', function () {
        var actual_song = SONGS_SELECTED[difficult - 1];
        if ($(this).data('song') == actual_song.song) {
            answer_secods = init_seconds;
            init_seconds = 40;

            SONGS_SELECTED[difficult - 1].win = true;
            SONGS_SELECTED[difficult - 1].seconds = answer_secods;

            $("#jquery_jplayer_1").jPlayer('play');

            Swal.fire({
                title: `${actual_song.song}`,
                html: `<p>Acertei a música ouvindo apenas ${answer_secods} segundos</p>`,
                icon: 'success',
                confirmButtonText: 'Próxima'
            }).then((result) => {
                if (result.isConfirmed) {
                    if (difficult - 1 === 0) {
                        finishGame();
                    } else {
                        nextSong();
                    }
                }
            });
        } else {
            answer_secods = init_seconds;
            init_seconds = 40;
            SONGS_SELECTED[difficult - 1].win = false;
            SONGS_SELECTED[difficult - 1].seconds = answer_secods;
            $("#jquery_jplayer_1").jPlayer('play');
            var actual_song = SONGS_SELECTED[difficult - 1];
            Swal.fire({
                title: `A Música era: `,
                html: `<p>${actual_song.song} ${random ? '- ' + actual_song.artist : '' }</p>`,
                icon: 'error',
                confirmButtonText: 'Próxima'
            }).then((result) => {
                if (result.isConfirmed) {
                    if (difficult - 1 === 0) {
                        finishGame();
                    } else {
                        nextSong();
                    }
                }
            });
        }
    });

    async function finishGame() {
        GAME.hide(300);
        SONGS_SELECTED.forEach(song => {
            var emoji = song.win ? '&#9989;' : '&#10060;'
            $('#answers').append(`<li >${song.song} ${random ? '- ' + song.artist : '' }  - ${emoji} -  ${song.seconds}s</li>`)
        })
        $("#win").show(300);
    }

    $('.newGame').on('click', function () {
        window.location.reload();
    })

    $('#nextSong').on('click', function () {
        answer_secods = init_seconds;
        init_seconds = 40;
        SONGS_SELECTED[difficult - 1].win = false;
        SONGS_SELECTED[difficult - 1].seconds = answer_secods;
        $("#jquery_jplayer_1").jPlayer('play');
        var actual_song = SONGS_SELECTED[difficult - 1];
        Swal.fire({
            title: `A Música era: `,
            html: `<p>${actual_song.song} ${random ? '- ' + actual_song.artist : '' }</p>`,
            icon: 'info',
            confirmButtonText: 'Próxima'
        }).then((result) => {
            if (result.isConfirmed) {
                if (difficult - 1 === 0) {
                    finishGame();
                } else {
                    nextSong();
                }
            }
        });
    })




    async function setMusic(song) {
        init_seconds = 1;
        var url = song.previewUrl;
        var song_name = song.song;

        var others = SONGS.filter(res => {
            if (res.song != song_name) {
                return res;
            }
        })
        shuffle(others);

        others = others.slice(0, 6);
        var options = others.concat(song);
        console.log(options);
        $('#bar').empty();


        $("#jquery_jplayer_1").jPlayer("destroy");

        myPlayer = new CirclePlayer("#jquery_jplayer_1",
            {
                m4a: url,
            }, {
            cssSelectorAncestor: "#cp_container_1"
        });

        myPlayer.player.bind($.jPlayer.event.timeupdate, function (event) {
            totalTimePlayed = event.jPlayer.status.currentTime;
            $('.timeMidi').text(totalTimePlayed);
            if (event.jPlayer.status.currentTime > init_seconds) {
                $(this).jPlayer('stop');
            }
        })

        shuffle(options);

        $('#songs').empty();

        options.forEach(el => {
            $('#songs').append(`<button class="btn btn-primary btn-user mr-1 mt-1 guess-song" data-song="${el.song}"> ${el.song} </button>`)
        })

        setTimeout(function () {
            $("#jquery_jplayer_1").jPlayer('play');

        }, 1000);
    }

    function shuffle(array) {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }
})
