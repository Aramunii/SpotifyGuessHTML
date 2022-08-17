var randomElement;

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

    $(document).on('click', '.guess-song', function () {
        if ($(this).data('song') === randomElement.song) {
                Swal.fire('Parabéns','Você acertou!','success').then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        window.location.reload();
                    } else if (result.isDenied) {
                    }
                });
        }else{
            swal.fire('Que pena!','Você errou!','error')
        }
    });


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

                $('#bar').buttonAudioPlayer({
                    type: 'bar-animation',
                    src: randomElement.previewUrl
                });

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
