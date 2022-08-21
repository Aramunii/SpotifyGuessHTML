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
var seeked = false;
var survival = false;

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
    var LOADING = $(".loading");
    var dificult_select = $(".difficult_select");
    var DIFF_SELECT = $('#dificultSelect');
    var GAME = $("#game");
    var SELECT_ARTIST = $('#selectMenu');
    var PLAYLIST = $('#selectPlaylist');

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const challenge = urlParams.get('challenge')

    /* SE FOR DE UM DESAFIO */
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
        artistName = json_challenge.artist
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

    $.ajax({
        url: endpoint + '/code',
        method: 'get',
        dataType: 'json',
        beforeSend: function () {
        },
        success: function (response) {
        }
    })



    // getPlaylist();
    //
    // getCategories();

    /* TELA DE ESCOLHER O ARTISTA OU GÊNERO  */
    $('#selectArtists').on('input', async function () {
        var search = $('#selectArtists').val();
        getArtists(search);
        getCategories(search);
        getPlaylist(search);
    })

    $('#selectGenres').on('input', async function () {
        var search = $('#selectGenres').val();
        getCategories(search);
    })

    $('#selectPlaylists').on('input',async function ()
    {
        var search = $('#selectPlaylists').val();
        getPlaylist(search);
    })

    async  function  getPlaylist(search ='')
    {
        $.ajax({
            url: endpoint + '/playlists?q=' + search,
            method: 'get',
            dataType: 'json',
            beforeSend: function () {
            },
            success: function (response) {
                $('#playlists').trigger("destroy.owl.carousel");
                $('#playlists').empty();
                $('#playlists-title').show();
                $('#playlist-name').text(response.message);
                var playlists = response.playlists.items;
                playlists.forEach(artist => {
                    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
                    $('#playlists').append(`
                    <div class="text-center select-playlist" style=" cursor: pointer;width: 180px" data-id="${artist.id}" data-name="${artist.name}">
                            <div class="LunqxlFIupJw_Dkx6mNx" style="height: 166px;background-color: ${getRandomColor()} ">
                                <div draggable="true" class="XiVwj5uoqqSFpS4cYOC6">
                                    <div class="xBV4XgMq0gC5lQICFWY_">
                                        <div class="g4PZpjkqEh5g7xDpCr2K yYflTYbufy7rATGQiZfq">
                                            <div class="">
                                                <img src="${artist.images[0].url}"
                                                     class="mMx2LUixlnN_Fu45JpFB SKJSok3LfyedjZjujmFt yYflTYbufy7rATGQiZfq">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="E1N1ByPFWo4AJLHovIBQ">
                                        <a>
                                            <div class="Type__TypeElement-goli3j-0 kgUbfh nk6UgB4GUYNoAcPtAQaG">${artist.name}
                                            </div>
                                        </a>
                                    </div>
                                    <div class="tsv7E_RBBw6v0XTQlcRo" data-testid="card-click-handler"></div>
                                </div>
                            </div>
                        </div>
                `)
                })

                $('#playlists').owlCarousel({
                    margin: 4,
                    loop: true,
                    autoWidth: true,
                    items: 4
                });
            }
        })
    }
    async function getArtists(search) {
        $.ajax({
            url: endpoint + '/search/artists?q=' + encodeURI(search),
            method: 'get',
            dataType: 'json',
            beforeSend: function () {
            },
            success: function (response) {
                if (response.length > 0) {
                    $('#artists').trigger("destroy.owl.carousel");
                    $('#artists').empty();
                    $('#artists-title').show()

                    response.forEach(artist => {
                        $('#artists').append(`
                    <div class=" text-center select-artist" style=" cursor: pointer;width: 180px" data-id="${artist.id}" data-name="${artist.name}">
                            <div class="LunqxlFIupJw_Dkx6mNx" style="height: 166px;background-color: ${getRandomColor()}">
                                <div draggable="true" class="XiVwj5uoqqSFpS4cYOC6">
                                    <div class="xBV4XgMq0gC5lQICFWY_">
                                        <div class="g4PZpjkqEh5g7xDpCr2K yYflTYbufy7rATGQiZfq">
                                            <div class="">
                                                <img src="${artist.images[1].url}"
                                                     class="mMx2LUixlnN_Fu45JpFB SKJSok3LfyedjZjujmFt yYflTYbufy7rATGQiZfq">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="E1N1ByPFWo4AJLHovIBQ">
                                        <a>
                                            <div class="Type__TypeElement-goli3j-0 kgUbfh nk6UgB4GUYNoAcPtAQaG">${artist.name}
                                            </div>
                                        </a>
                                    </div>
                                    <div class="tsv7E_RBBw6v0XTQlcRo" data-testid="card-click-handler"></div>
                                </div>
                            </div>
                        </div>
`)

                    })
                    $('#artists').owlCarousel({
                        margin: 4,
                        loop: true,
                        autoWidth: true,
                        items: 4
                    });
                }

            }
        })
    }

    async function getCategories(search = '') {
        $.ajax({
            url: endpoint + '/categories?q=' + search,
            method: 'get',
            dataType: 'json',
            beforeSend: function () {
            },
            success: function (response) {
                var categories = response;
                $('#genres').trigger("destroy.owl.carousel");
                $('#genres').empty();
                if(categories.length >0)
                {                $('#genre-title').show();
                }
                categories.forEach(artist => {
                    $('#genres').append(`
                    <div class=" text-center select-categorie" style=" cursor: pointer;width: 180px;" data-id="${artist.id}" data-name="${artist.name}">
                            <div class="LunqxlFIupJw_Dkx6mNx" style="height: 166px;background-color: ${getRandomColor()} ">
                                <div draggable="true" class="XiVwj5uoqqSFpS4cYOC6">
                                    <div class="xBV4XgMq0gC5lQICFWY_">
                                        <div class="g4PZpjkqEh5g7xDpCr2K yYflTYbufy7rATGQiZfq">
                                            <div class="">
                                                <img src="${artist.icons[0].url}"
                                                     class="mMx2LUixlnN_Fu45JpFB SKJSok3LfyedjZjujmFt yYflTYbufy7rATGQiZfq">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="E1N1ByPFWo4AJLHovIBQ">
                                        <a>
                                            <div class="Type__TypeElement-goli3j-0 kgUbfh nk6UgB4GUYNoAcPtAQaG">${artist.name}
                                            </div>
                                        </a>
                                    </div>
                                    <div class="tsv7E_RBBw6v0XTQlcRo" data-testid="card-click-handler"></div>
                                </div>
                            </div>
                        </div>
                `)
                })

                $('#genres').owlCarousel({
                    margin: 4,
                    loop: true,
                    autoWidth: true,
                    items: 4
                });
            }
        })
    }

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

    $(document).on('click', '.select-playlist', function () {
        random = true;
        DIFF_SELECT.show(300);
        SELECT_ARTIST.hide(300);
        PLAYLIST.hide(300);
        genre = $(this).data('name');
        getSongsByPlaylist($(this).data('id'));
        $('#artist_title').text(genre.slice(0, 1).toUpperCase() + genre.slice(1));
        artistName = genre.slice(0, 1).toUpperCase() + genre.slice(1);
    })

    async function getSongsByPlaylist(genre) {
        query_string = genre;
        type_query = 'playlist';

        $.ajax({
            url: endpoint + '/playlists/songs?q=' + encodeURI(genre),
            method: 'get',
            dataType: 'json',
            beforeSend: function () {
                dificult_select.hide();
                LOADING.show(300);
                $('#challenge_start').hide();
                $('#loading-challenge').show(300);
            },
            success: function (response) {
                if(response.length >0)
                {
                    dificult_select.show(300);
                    LOADING.hide(300);
                    SONGS = response;
                    $('#challenge_start').show();
                    $('#loading-challenge').hide(300);
                }else{
                    swal.fire('Playlist inválida','Ocorreu um erro com sua playlist, verifique o link e tente novamente','error');
                }

            }
        });
    }

    $(document).on('click', '.select-categorie', function () {
        PLAYLIST.show(300);
        SELECT_ARTIST.hide(300);
        getPlaylistsCategories($(this).data('id'))
    })

    async function getPlaylistsCategories(genre) {
        query_string = genre;
        type_query = 'playlist';
        $.ajax({
            url: endpoint + '/categories/playlist?q=' + encodeURI(genre),
            method: 'get',
            dataType: 'json',
            beforeSend: function () {
                dificult_select.hide();
                LOADING.show(300);
            },
            success: function (response) {
                dificult_select.show(300);
                LOADING.hide(300);
                if (response.length > 0) {
                    response.forEach(artist => {
                        $('#playlists-categories').append(`
                    <div class=" text-center select-playlist" style=" cursor: pointer;width: 180px" data-id="${artist.id}" data-name="${artist.name}">
                            <div class="LunqxlFIupJw_Dkx6mNx" style="height: 166px;background-color: ${getRandomColor()} ">
                                <div draggable="true" class="XiVwj5uoqqSFpS4cYOC6">
                                    <div class="xBV4XgMq0gC5lQICFWY_">
                                        <div class="g4PZpjkqEh5g7xDpCr2K yYflTYbufy7rATGQiZfq">
                                            <div class="">
                                                <img src="${artist.images[0].url}"
                                                     class="mMx2LUixlnN_Fu45JpFB SKJSok3LfyedjZjujmFt yYflTYbufy7rATGQiZfq">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="E1N1ByPFWo4AJLHovIBQ">
                                        <a>
                                            <div class="Type__TypeElement-goli3j-0 kgUbfh nk6UgB4GUYNoAcPtAQaG">${artist.name}
                                            </div>
                                        </a>
                                    </div>
                                    <div class="tsv7E_RBBw6v0XTQlcRo" data-testid="card-click-handler"></div>
                                </div>
                            </div>
                        </div>
                `)
                    })

                    $('#playlists-categories').owlCarousel({
                        margin: 4,
                        loop: true,
                        autoWidth: true,
                        items: 4
                    });
                } else {
                    $('#difficult_select').append(`<h6 class="Type__TypeElement-goli3j-0 dnNHjd MfVrtIzQJ7iZXfRWg6eM text-center mb-1">A API DO SPOTIFY NÃO RETORNOU NENHUMA PLAYLIST</h6>
<button onclick="window.location.href = 'https://aramunii.github.io/SpotifyGuessHTML/'"
                                                class="btn btn-primary text-default btn-user btn-block share Type__TypeElement-goli3j-0 dnNHjd MfVrtIzQJ7iZXfRWg6eM">
                                            Novo
                                            jogo
                                        </button>`)
                }


            }
        });
    }

    /*  TElA DE ESCOLHER MODO DE JOGO*/
    $('.select-diff').on('click', function () {
        console.log($(this).text());
        SONGS = [
            ...new Map(SONGS.map((item) => [item["song"], item])).values(),
        ];
        if ($(this).text() == 'Até errar!') {

            difficult = SONGS.length;
            difficult_selected = SONGS.length;
            survival = true;
        } else {
            difficult = parseInt($(this).text())
            difficult_selected = parseInt($(this).text())
        }

        setSongs();
    })

    async function setSongs() {

        const shuffled = SONGS.sort(() => 0.5 - Math.random());
        let selected = shuffled.slice(0, difficult);
        console.log(selected);

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
        console.log(SONGS_SELECTED)

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
        $('#mode_game').text($(this).text() + survival ? '(Até errar!)' : "");
        startGame();
    })

    $('.playlist-play').on('click', function () {
        Swal.fire({
            title: 'Cole o link de uma playlist do spotify!',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Jogar!',
            showLoaderOnConfirm: true,
            preConfirm: async (url) => {
                if(!url.split('/')[4])
                {
                    Swal.showValidationMessage(
                        `Informe uma playlist válida`
                    );
                }else{
                    var url_new = url.split('/')[4].split('?')[0];
                    return  getMyPlaylist(url_new)
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if(result.isConfirmed)
            {
                DIFF_SELECT.show(300);
                SELECT_ARTIST.hide(300);
                PLAYLIST.hide(300);
                console.log(result);
                dificult_select.show(300);
                LOADING.hide(300);
                $('#challenge_start').show();
                $('#loading-challenge').hide(300);
            }
        })
    });



   async function getMyPlaylist(genre) {
        query_string = genre;
        type_query = 'playlist';

        $.ajax({
            url: endpoint + '/playlist?q=' + encodeURI(genre),
            method: 'get',
            dataType: 'json',
            beforeSend: function () {
                dificult_select.hide();
                LOADING.show(300);
                $('#challenge_start').hide();
                $('#loading-challenge').show(300);
            },
            success: function (response) {
                if(response)
                {
                    var songs = [];
                    response.tracks.items.map(track => {
                        if (track.track) {
                            if (track.track.name.includes('Live') || track.track.name.includes('Ao Vivo') || track.track.name.includes('(Ao Vivo)') || track.track.name.includes("Commentary")) {
                            } else {
                                if (track.track.preview_url) {
                                    songs.push({ previewUrl: track.track.preview_url, artist: track.track.artists[0].name, song: track.track.name });
                                }
                            }
                        }
                    })
                    SONGS = songs;
                    artistName = response.name;
                    $('#artist_title').text(artistName);
                }else{
                    swal.fire('Playlist inválida','Ocorreu um erro com sua playlist, verifique o link e tente novamente','error');
                }
            }
        });
    }

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


    async function guessWin(actual_song) {
        answer_secods = mode == 'default' ? init_seconds : totalTimePlayed;
        init_seconds = 40;
        totalTimePlayed = 0;

        SONGS_SELECTED[difficult - 1].win = true;
        SONGS_SELECTED[difficult - 1].played = true;
        SONGS_SELECTED[difficult - 1].seconds = answer_secods;

        $('.timeMidi').hide();
        $("#jquery_jplayer_1").jPlayer('play');

        Swal.fire({
            title: `${actual_song.song}`,
            html: `<p>Acertei a música ouvindo apenas ${answer_secods} segundos</p>`,
            icon: 'success',
            confirmButtonText: 'Próxima',
            allowOutsideClick: false,
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

    async function guessWrong(actual_song) {
        answer_secods = mode == 'default' ? init_seconds : totalTimePlayed;
        init_seconds = 40;
        totalTimePlayed = 0;

        SONGS_SELECTED[difficult - 1].win = false;
        SONGS_SELECTED[difficult - 1].played = true;
        SONGS_SELECTED[difficult - 1].seconds = answer_secods;

        $('.timeMidi').hide();
        $("#jquery_jplayer_1").jPlayer('play');

        var actual_song = SONGS_SELECTED[difficult - 1];

        Swal.fire({
            title: `A Música era: `,
            html: `<p>${actual_song.song} ${random ? '- ' + actual_song.artist : ''}</p>`,
            icon: 'error',
            confirmButtonText: 'Próxima',
            allowOutsideClick: false,
        }).then((result) => {
            if (result.isConfirmed) {
                if (difficult - 1 === 0 || survival) {
                    finishGame();
                } else {
                    nextSong();
                }
            }
        });
    }

    $(document).on('click', '.guess-song', function () {
        var actual_song = SONGS_SELECTED[difficult - 1];

        if (type_mode != 'artist') {
            if ($(this).data('song') == actual_song.song) {
                guessWin(actual_song);
            } else {
                guessWrong(actual_song)
            }
        } else {
            if ($(this).data('artist') == actual_song.artist) {
                guessWin(actual_song);
            } else {
                guessWrong(actual_song)
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
                var emoji = song.win ? '🟩 ' : '🟥 '
                var emoji2 = json_challenge.song_selected[index].win ? '🟩 ' : '🟥 '
                $('#challenge_table').append(`
                <tr>
                    <td>${song.song} ${random ? '- ' + song.artist : ''}  -</td>
                    <td>${emoji} -  ${song.seconds.toFixed(2)}s</td>
                    <td>${emoji2} -  ${json_challenge.song_selected[index].seconds.toFixed(2)}s</td>
                </tr>`)
            })
            $("#win_challenge").show(300);
        } else {
            var count = 0;

            SONGS_SELECTED.forEach(song => {
                var emoji = song.win ? '🟩 ' : '🟥 '

                if (survival) {
                    if (song.played) {
                        $('#answers').append(`<p >${emoji} ${song.song} ${random ? '- ' + song.artist : ''} - ${song.seconds.toFixed(2)}s</p>`)
                        if (song.win) {
                            count++;
                        }
                    }
                } else {
                    $('#answers').append(`<p >${emoji} ${song.song} ${random ? '- ' + song.artist : ''} - ${song.seconds.toFixed(2)}s</p>`)
                }
            })

            if (survival) {
                $('#survival_count').append(`<span class="text-success">${count}</span>/${SONGS_SELECTED.length}`);
            }
            $("#win").show(300);
        }

        if (difficult_selected > 5) {
            $('.challenge').hide();

        }
    }

    $('.newGame').on('click', function () {
        window.location.href = 'https://aramunii.github.io/SpotifyGuessHTML/';
    })

    $('#nextSong').on('click', function () {
        guessWrong();
    })

    $(".challenge").on('click', async function () {
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
                await $.ajax(settings).done(async function (response) {
                    urlchall = response.url.shortLink
                });

            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Seu desafio está pronto',
                    text: "Copie e envie para desafiar alguem!",
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Copiar desafio!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        var my_result = '';

                        SONGS_SELECTED.reverse().forEach(song => {
                            my_result += song.win ? '🟩 ' : '🟥 '
                        });

                        copyStringToClipboard(`Estou te desafiando em *${artistName}* no SongGuess! clique no lnk abaixo e tente ganhar de mim! \n\n 🎵 ${my_result} \n\n` + urlchall);
                        Swal.fire('Link copiado', '', 'success');
                    }
                })
            }
        })
    })

    $('.share-result').on('click', function () {
        shareResult();
    })

    async function shareResult() {
        if (challenge) {
            Swal.fire({
                title: 'Digite o seu nome!',
                input: 'text',
                inputAttributes: {
                    autocapitalize: 'off'
                },
                showCancelButton: true,
                confirmButtonText: 'Compartilhar resultado',
                preConfirm: async (login) => {
                    var my_result = '';
                    var challenge_result = '';

                    new_challenge = challenge.replaceAll('-', "+")
                    new_challenge = new_challenge.replaceAll('_', "/")
                    var decrypted = CryptoJS.AES.decrypt(new_challenge, key);
                    let json_challenge = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));

                    SONGS_SELECTED.reverse().forEach((song, index) => {
                        my_result += song.win ? '🟩 ' : '🟥 '
                        challenge_result += json_challenge.song_selected[index].win ? '🟩 ' : '🟥 '
                    })

                    copyStringToClipboard(`Desafio *${artistName}* no SongGuess!\n\n*${login}* ${my_result}\n\n*${json_challenge.name}* ${challenge_result}\n\n` + 'Acesse para jogar : https://cutt.ly/yXEPa4k');
                    Swal.fire('Copiado', '', 'success');
                },
            })
        } else {
            var my_result = '';
            var count = 0;

            SONGS_SELECTED.reverse().forEach((song, index) => {
                if (survival) {
                    if (song.played) {
                        my_result += song.win ? '🟩 ' : '🟥 '
                        if (song.win) {
                            count++;
                        }
                    }
                } else {
                    my_result += song.win ? '🟩 ' : '🟥 '
                }
            })

            if (survival) {
                copyStringToClipboard(`Meu resultado em  *${artistName}* Até errar no SongGuess!\n\n*${count}*/${SONGS_SELECTED.length}\n\n ${my_result} \n\n` + 'Acesse para jogar : https://cutt.ly/yXEPa4k');

            } else {
                copyStringToClipboard(`Meu resultado em  *${artistName}* no SongGuess!\n\n ${my_result} \n\n` + 'Acesse para jogar : https://cutt.ly/yXEPa4k');
            }

            Swal.fire('Copiado', '', 'success');
        }

    }


    async function setMusic(song) {
        console.log(song);
        init_seconds = 1;
        var url = song.previewUrl;
        var song_name = song.song;

        var others = SONGS.filter(res => {
            if (res.song != song_name) {
                return res;
            }
        })

        shuffle(others);

        others = others.slice(0, 3);
        var options = others.concat(song);

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
                $('.timeMidi').text(totalTimePlayed.toFixed(2));
            }
        })

        myPlayer.player.bind($.jPlayer.event.pause, function (event) {
            if (mode == 'time' && event.jPlayer.status.currentTime < 29) {
                $(this).jPlayer('play');
            }
        })

        myPlayer.player.bind($.jPlayer.event.seeked, function (event) {
            if (mode == 'time') {
                Swal.fire({
                    title: 'Você não pode trapacear!!!',
                    text: "",
                    icon: 'error',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Próxima',
                    allowOutsideClick: false,
                }).then((result) => {
                    if (result.isConfirmed) {
                        if (difficult - 1 === 0) {
                            finishGame();
                        } else {
                            nextSong();
                        }
                    }
                })
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
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    function copyStringToClipboard(str) {
        var el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style = {position: 'absolute', left: '-9999px'};
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
})
