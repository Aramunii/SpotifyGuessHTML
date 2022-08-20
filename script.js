var randomElement;
var init_seconds = 1;
var endpoint = 'https://song-guess2.herokuapp.com';
// var endpoint = 'http://localhost:30850'
var difficult = 0;
var difficult_selected = 0;
var totalTimePlayed = 0;
var key = "something";
var query_string = '';
var type_query = 'artist';
var urlchall = '';

SONGS = [];
SONGS_SELECTED = [];
CHALLENGER_SONGS = [];
artistName = '';

random = false;
challenger = false;

mode = 'default';
type_mode = 'music';
json_challenge = [];
GENRES = ["acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime", "black-metal", "blues", "bossanova", "brazil", "breakbeat", "british", "cantopop", "chicago-house", "children", "chill", "classical", "club", "comedy", "country", "dance", "dancehall", "death-metal", "deep-house", "disco",
    "dubstep", "edm", "electro", "electronic", "emo", "folk", "forro", "french", "funk", "garage", "german", "gospel", "goth", "grindcore", "groove", "grunge", "guitar", "happy", "hard-rock", "hardcore",
    "hardstyle", "heavy-metal", "hip-hop", "house", "idm", "indian", "indie", "indie-pop", "industrial", "iranian", "j-dance", "j-idol", "j-pop", "j-rock", "jazz", "k-pop", "kids", "latin", "latino", "malay", "mandopop", "metal", "metal-misc", "metalcore", "mpb", "new-age", "new-release",
    "opera", "pagode", "party", "pop", "pop-film", "power-pop", "progressive-house", "psych-rock", "punk", "punk-rock", "r-n-b", "rainy-day", "reggae", "reggaeton", "road-trip", "rock", "rock-n-roll", "rockabilly", "romance", "sad", "salsa", "samba",
    "sertanejo", "show-tunes", "singer-songwriter", "ska", "sleep", "songwriter", "soul", "soundtracks", "spanish", "study", "summer", "swedish", "synth-pop", "tango", "techno", "trance", "trip-hop", "turkish", "work-out", "world-music"]

$(function () {
    /* INICIA VARIAVEIS */
    var LOADING = $("#loading");
    var dificult_select = $("#difficult_select");
    var DIFF_SELECT = $('#dificultSelect');
    var GAME = $("#game");
    var SELECT_ARTIST = $('#selectMenu');

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const challenge = urlParams.get('challenge')

    if (challenge) {
        challenger = true;
        $('#challenge_menu').show(300);
        SELECT_ARTIST.hide(300);
        new_challenge = challenge.replaceAll('-', "+")
        new_challenge = new_challenge.replaceAll('_', "/")
        var decrypted = CryptoJS.AES.decrypt(new_challenge, key);
        json_challenge = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
        $('#name_challenge').text(json_challenge.name);

        if (json_challenge.mode == 'time') {
            $('#mode_name').text('Contra o tempo');
        } else {
            $('#mode_name').text('Padrão');
        }
        $('#artist_name').text(json_challenge.artist);

        SONGS_SELECTED = json_challenge.song_selected.slice();
        CHALLENGER_SONGS = new Array(json_challenge.song_selected);

        SONGS = json_challenge.SONGS;

        type_mode = json_challenge.type_mode;
        mode = json_challenge.mode;
        difficult = json_challenge.difficult;
        $('#artist_title_challenge').text(json_challenge.artist);
        $('#challenger').text(json_challenge.name);

        if (json_challenge.type_query == 'artist') {
            getSongsByArtist(json_challenge.query);
        } else {
            getSongsByGenre(json_challenge.query);
        }

    }

    $('.acceptChallenge').on('click', function () {
        $('#challenge_menu').hide(300);
        startGame();
    })


    /* RANDOMIZA O GÊNERO E PEGA O AUTH  */
    shuffledGENRE = GENRES.sort(() => 0.5 - Math.random());

    shuffledGENRE.forEach(genre => {
        $("#genres").append(`<div class='bg-grey select-genre' data-genre='${genre}'><a>${genre.slice(0, 1).toUpperCase() + genre.slice(1).replace('-', ' ')}</a></div>`)
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



    /* TELA DE ESCOLHER O ARTISTA OU GÊNERO  */
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

    async function getSongsByArtist(artist) {
        query_string = artist;
        type_query = 'artist';
        $.ajax({
            url: endpoint + '/albums?q=' + encodeURI(artist),
            method: 'get',
            dataType: 'json',
            beforeSend: function () {
                dificult_select.hide();
                LOADING.show(300);
                $('#challenge_start').hide();
                $('#loading-challenge').show(300);
            },
            success: function (response) {
                dificult_select.show(300);
                LOADING.hide(300);
                SONGS = response;
                $('#challenge_start').show();
                $('#loading-challenge').hide(300);
            }
        });
    }

    $(document).on('click', '.select-genre', function () {
        random = true;
        DIFF_SELECT.show(300);
        SELECT_ARTIST.hide(300);
        genre = $(this).data('genre');
        getSongsByGenre(genre);
        $('#artist_title').text(genre.slice(0, 1).toUpperCase() + genre.slice(1));
        artistName = genre.slice(0, 1).toUpperCase() + genre.slice(1);
    })

    async function getSongsByGenre(genre) {
        query_string = genre;
        type_query = 'genre';

        $.ajax({
            url: endpoint + '/random?q=' + encodeURI(genre),
            method: 'get',
            dataType: 'json',
            beforeSend: function () {
                dificult_select.hide();
                LOADING.show(300);
                $('#challenge_start').hide();
                $('#loading-challenge').show(300);
            },
            success: function (response) {
                dificult_select.show(300);
                LOADING.hide(300);
                SONGS = response;
                $('#challenge_start').show();
                $('#loading-challenge').hide(300);
            }
        });
    }

    /*  TElA DE ESCOLHER MODO DE JOGO*/
    $('.select-diff').on('click', function () {
        difficult = parseInt($(this).text())
        difficult_selected = parseInt($(this).text())

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

        DIFF_SELECT.hide(300);
        $("#modeSelect").show(300);
        if (!random) {
            $('#type_select').hide(300);
            $('#mode_select').show(300);
        }
    }


    $('.type-game').on('click', function () {
        type_mode = $(this).data('mode');
        $('#type_mode').text($(this).text());
        $('#type_select').hide(300);
        $('#mode_select').show(300);
    })

    $('.mode-select').on('click', function () {
        mode = $(this).data('mode');
        $('#mode_game').text($(this).text());
        startGame();
    })


    async function startGame() {
        $("#modeSelect").hide(300);
        DIFF_SELECT.hide(300);
        GAME.show(300);
        setMusic(SONGS_SELECTED[difficult - 1])
    }

    async function nextSong() {
        difficult--;
        setMusic(SONGS_SELECTED[difficult - 1])
        if (mode == 'time') {
            $('.timeMidi').show();
        }
    }


    $('#moreSeconds').on('click', function () {
        init_seconds++;
        $("#jquery_jplayer_1").jPlayer('play');
    })

    $(document).on('click', '.guess-song', function () {
        var actual_song = SONGS_SELECTED[difficult - 1];

        if (type_mode != 'artist') {
            if ($(this).data('song') == actual_song.song) {
                answer_secods = mode == 'default' ? init_seconds : totalTimePlayed;
                init_seconds = 40;
                totalTimePlayed = 0;

                SONGS_SELECTED[difficult - 1].win = true;
                SONGS_SELECTED[difficult - 1].seconds = answer_secods;

                $('.timeMidi').hide();
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
                answer_secods = mode == 'default' ? init_seconds : totalTimePlayed;
                init_seconds = 40;
                totalTimePlayed = 0;

                SONGS_SELECTED[difficult - 1].win = false;
                SONGS_SELECTED[difficult - 1].seconds = answer_secods;

                $('.timeMidi').hide();
                $("#jquery_jplayer_1").jPlayer('play');

                var actual_song = SONGS_SELECTED[difficult - 1];

                Swal.fire({
                    title: `A Música era: `,
                    html: `<p>${actual_song.song} ${random ? '- ' + actual_song.artist : ''}</p>`,
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

        } else {

            if ($(this).data('artist') == actual_song.artist) {
                answer_secods = mode == 'default' ? init_seconds : totalTimePlayed;
                init_seconds = 40;
                totalTimePlayed = 0;

                SONGS_SELECTED[difficult - 1].win = true;
                SONGS_SELECTED[difficult - 1].seconds = answer_secods;

                $('.timeMidi').hide();
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
                answer_secods = mode == 'default' ? init_seconds : totalTimePlayed;
                init_seconds = 40;
                totalTimePlayed = 0;

                SONGS_SELECTED[difficult - 1].win = false;
                SONGS_SELECTED[difficult - 1].seconds = answer_secods;

                $('.timeMidi').hide();
                $("#jquery_jplayer_1").jPlayer('play');

                var actual_song = SONGS_SELECTED[difficult - 1];
                Swal.fire({
                    title: `A Música era: `,
                    html: `<p>${actual_song.song} ${random ? '- ' + actual_song.artist : ''}</p>`,
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
        }
    });

    async function finishGame() {
        GAME.hide(300);

        if (challenger) {

            new_challenge = challenge.replaceAll('-', "+")
            new_challenge = new_challenge.replaceAll('_', "/")
            var decrypted = CryptoJS.AES.decrypt(new_challenge, key);
            let json_challenge = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));

            SONGS_SELECTED.forEach((song, index) => {
                var emoji = song.win ? '&#9989;' : '&#10060;'
                var emoji2 = json_challenge.song_selected[index].win ? '&#9989;' : '&#10060;'
                $('#challenge_table').append(`
                <tr>
                    <td>${song.song} ${random ? '- ' + song.artist : ''}  -</td>
                    <td>${emoji} -  ${song.seconds.toFixed(2)}s</td>
                    <td>${emoji2} -  ${json_challenge.song_selected[index].seconds.toFixed(2)}s</td>
                </tr>`)
            })
            $("#win_challenge").show(300);
        } else {
            SONGS_SELECTED.forEach(song => {
                var emoji = song.win ? '&#9989;' : '&#10060;'
                $('#answers').append(`<li >${song.song} ${random ? '- ' + song.artist : ''}  - ${emoji} -  ${song.seconds}s</li>`)
            })
            $("#win").show(300);
        }

    }

    $('.newGame').on('click', function () {
        window.location.href = 'https://aramunii.github.io/SpotifyGuessHTML/';
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
            html: `<p>${actual_song.song} ${random ? '- ' + actual_song.artist : ''}</p>`,
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

    $(".challenge").on('click', function () {


        Swal.fire({
            title: 'Digite o seu nome!',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Enviar desafio',
            showLoaderOnConfirm: true,
            preConfirm: async (login) => {
                var challenge = {
                    song_selected: SONGS_SELECTED,
                    // SONGS: SONGS,
                    name: login,
                    difficult: difficult_selected,
                    mode: mode,
                    type_mode: type_mode,
                    artist: artistName,
                    query: query_string,
                    type_query: type_query
                }

                var challenge_string = JSON.stringify(challenge);
                var encrypted = CryptoJS.AES.encrypt(challenge_string, key);
                var settings = {
                    "url": endpoint + "/urlShort",
                    "method": "POST",
                    "timeout": 0,
                    "headers": {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    "data": {
                        "code": '' + encrypted
                    }
                };

            await   $.ajax(settings).done(async function (response) {
urlchall = response.url.shortLink
                  await  copyStringToClipboard(`Estou te desafiando em *${artistName}* no SongGuess! clique no link abaixo e tente ganhar de mim! \n` + response.url.shortLink);
alert(`Estou te desafiando em *${artistName}* no SongGuess! clique no link abaixo e tente ganhar de mim! \n` + response.url.shortLink)
                  await  copyStringToClipboard(`Estou te desafiando em *${artistName}* no SongGuess! clique no link abaixo e tente ganhar de mim! \n` + response.url.shortLink);
                });

            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {

                    //copyStringToClipboard(`Estou te desafiando em *${artistName}* no SongGuess! clique no link abaixo e tente ganhar de mim! \n` + urlchall);

                Swal.fire('Link copiado', 'Envie o link para o amigo!!', 'success');
            }
        })




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

            if (mode == 'default') {
                $('.timeMidi').hide();
                if (event.jPlayer.status.currentTime > init_seconds) {
                    $(this).jPlayer('stop');
                }
            } else if (mode == 'time') {
                $('#moreSeconds').hide();
                totalTimePlayed = event.jPlayer.status.currentTime;
                $('.timeMidi').text(totalTimePlayed);
            }
        })

        shuffle(options);

        $('#songs').empty();

        if (type_mode == 'music') {
            options.forEach(el => {
                $('#songs').append(`<button class="btn btn-primary btn-user mr-1 mt-1 guess-song" data-song="${el.song}"> ${el.song} </button>`)
            })

        } else if (type_mode == 'artist') {
            options.forEach(el => {
                $('#songs').append(`<button class="btn btn-primary btn-user mr-1 mt-1 guess-song" data-artist="${el.artist}"> ${el.artist}</button>`)
            })
        } else {
            options.forEach(el => {
                $('#songs').append(`<button class="btn btn-primary btn-user mr-1 mt-1 guess-song" data-song="${el.song}"> ${el.song}  ${random ? '- ' + el.artist : ''}</button>`)
            })
        }


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

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}

   function copyStringToClipboard(str) {
        // Create new element
        var el = document.createElement('textarea');
        // Set value (string to be copied)
        el.value = str;
        // Set non-editable to avoid focus and move outside of view
        el.setAttribute('readonly', '');
        el.style = { position: 'absolute', left: '-9999px' };
        document.body.appendChild(el);
        // Select text inside element
        el.select();
        // Copy text to clipboard
        document.execCommand('copy');
        // Remove temporary element
        document.body.removeChild(el);
    }

})
