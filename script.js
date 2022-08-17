var randomElement;
var init_seconds = 1;
$(function () {

    async function fetchArtists() {
        await fetch('https://aramunii.github.io/song-guess/data.json').then(function (response) {
            // The API call was successful!
            return response.text();
        }).then(async function (html) {
            all_artists = JSON.parse(html);
        });

    }

    fetchArtists();

    $('#selectArtists').on('input', async function () {
        var search = $('#selectArtists').val();
        $.ajax({
            url: 'https://song-guess2.herokuapp.com/search/artists?q=' + encodeURI(search),
            method: 'get',
            dataType: 'json',
            beforeSend: function () {
            },
            success: function (response) {
                console.log(response);

                $('#artists').empty();

                response.forEach(artist => {
                    $('#artists').append(`
                            <div class="col-md-4 text-center" style=" cursor: pointer">
                                <a class="select-artist" data-id="${artist.id}" >
                                 <img src="${artist.images[2].url}">
                                 <h4 class="text-default">${artist.name}</h4>
                                </a>
                            </div>`)
                })
            }
        })
    })

    $('#moreSeconds').on('click',function ()
    {
        init_seconds++;
        $("#jquery_jplayer_1").jPlayer('play');
    })
    $(document).on('click', '.guess-song', function () {
        if ($(this).data('song') == randomElement.song) {
            answer_secods = init_seconds;
            init_seconds=40;
            $("#jquery_jplayer_1").jPlayer('play');
            Swal.fire({
                title: `${randomElement.song}`,
                html:`<p>Acertei a música ouvindo apenas ${answer_secods} segundos</p>`,
                icon: 'success',
                confirmButtonText: 'Ok'
            }).then((result) => {

                if (result.isConfirmed) {
                    window.location.reload();
                }
            });
        }else{
            Swal.fire({
                title: `Você errou`,
                html:``,
                icon: 'error',
                showDenyButton: true,
                confirmButtonText: 'Continuar',
                denyButtonText: `Novo Jogo`,
            }).then((result) => {
                if (result.isConfirmed) {
                    init_seconds++;
                    $("#jquery_jplayer_1").jPlayer('play');
                } else if (result.isDenied) {
                    window.location.reload();
                }
            });
        }
    });

    async function setMusic(url) {
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

        myPlayer.player.bind($.jPlayer.event.play, function (event) {
           console.log('DEU PLAY');
           // setTimeout(init_seconds, )
        })

        // $("#jquery_jplayer_1").jPlayer({
        //     timeupdate: function(event) { // 4Hz
        //         // Restrict playback to first 60 seconds.
        //
        //     }
        //     // Then other options, such as: ready, swfPath, supplied and so on.
        // });

    }

    $(document).on('click', '.select-artist', function () {
        $.ajax({
            url: 'https://song-guess2.herokuapp.com/toptrack?q=' + encodeURI($(this).data('id')),
            method: 'get',
            dataType: 'json',
            beforeSend: function () {
            },
            success: function (response) {
                $('#dificultSelect').show(300);
                randomElement = response[Math.floor(Math.random() * response.length)];
                console.log(randomElement);

                var others = response.filter(res => {
                    if (res.song !== randomElement.song) {
                        return res;
                    }
                })

                others = others.slice(0, 3);
                var options = others.concat(randomElement);

                $('#bar').empty();

                setMusic(randomElement.previewUrl)

                shuffle(options);
                $('#songs').empty();
                options.forEach(el => {
                    $('#songs').append(`<button class="btn btn-primary btn-user mr-1 mt-1 guess-song" data-song="${el.song}"> ${el.song} </button>`)
                })
                $('#selectMenu').hide();
            }

        });

    })

    $("#searchButton").on('click', async function () {

        var search = $('#selectArtists').val();

        $.ajax({
            url: 'https://song-guess2.herokuapp.com/search/artists?q=' + encodeURI(search),
            method: 'get',
            dataType: 'json',
            beforeSend: function () {
            },
            success: function (response) {

                $('#artists').empty();

                response.forEach(artist => {
                    $('#artists').append(`
                            <div class="col-md-4 text-center">
                                <img src="${artist.image}">
                                <h4>${artist.name}</h4>
                            </div>
`)
                })

                console.log(response);
            }
        })


    })


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
