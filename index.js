const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function main() {

    var artists_all = [];

    var pages = [
        "/browse/0-9.html",
        "/browse/a.html",
        "/browse/b.html",
        "/browse/c.html",
        "/browse/d.html",
        "/browse/e.html",
        "/browse/f.html",
        "/browse/g.html",
        "/browse/h.html",
        "/browse/i.html",
        "/browse/j.html",
        "/browse/k.html",
        "/browse/l.html",
        "/browse/m.html",
        "/browse/n.html",
        "/browse/o.html",
        "/browse/p.html",
        "/browse/q.html",
        "/browse/r.html",
        "/browse/s.html",
        "/browse/t.html",
        "/browse/u.html",
        "/browse/v.html",
        "/browse/w.html",
        "/browse/x.html",
        "/browse/y.html",
        "/browse/z.html"
    ];

    // var pages = [
    //     "/browse/a.html",
    // ];

    var mids = [];
    const forLoop = async _ => {
        console.log('Start')

        for (i = 1; i <= 883; i++) {
            var response = await axios.get(`https://www.mididb.com/search.asp?currentPage=${i}&q=e&filter=midi&sort=`);
            const $ = cheerio.load(response.data);

            const songsArray = $('.list').find('li').toArray();
            selectedMidi = songsArray.map(song => {
                var title = $(song).find('.song-title').find('span').text();
                var artist = $(song).find('.artist-name').find('a').text();
                var link = $(song).find('.song-control').find('.audio').data('audio-url');
                mids.push({ title: title, artist: artist, link: link });
                return { title: title, artist: artist, link: link }
            })
            console.log(i);
        }

        fs.writeFileSync('./dataSong.json', JSON.stringify(mids));

        console.log('End')
    }

    forLoop();



    // pages.forEach(async letter => {
    //     var response = await axios.get('https://www.vagalume.com.br' + letter);
    //     const $ = cheerio.load(response.data);
    //     var artists = $('.moreNamesContainer').find('li').toArray();

    //     artists.forEach(artist => {
    //         artists_all.push({
    //             'name': $(artist).find('a').text(),
    //             'link':  $(artist).find('a').attr('href')
    //         });

    //     });

    //     fs.writeFileSync('./data.json', JSON.stringify(artists_all));

    // });


}

async function getLyric(href) {

}


main();