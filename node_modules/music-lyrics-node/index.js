const axios = require('axios');
const cheerio = require('cheerio');
const endpoint = 'https://www.letras.mus.br/'

exports.getLyric = async function getLyric(search) {
    search = encodeURIComponent(search.trim())
    var response = await axios.get('https://cse.google.com/cse/element/v1?rsz=filtered_cse&num=10&hl=pt-PT&source=gcsc&gss=.br&cselibv=ff97a008b4153450&cx=000985329112107235723:orkf-eprrfa&q=' + search + '&safe=off&cse_tok=AJvRUv2jqdG18wuWFrC1fLMiZoXA:1639747835778&sort=&exp=csqr,cc&callback=google.search.cse.api3031');
    response = response.data.replace(`/*O_o*/`, '')
    response = response.replace(`google.search.cse.api3031(`, '')
    response = response.replace(');', '');
    response = JSON.parse(response);
    let results = response.results;
    links = results.filter(element => {
        return !element.url.includes('traducao');
    })

    var response2 = await axios.get(links[0].url);
    const $ = cheerio.load(response2.data);

    let lyric = $('#lyrics').html();
    let song = $('.col1-2-1').find('h1').text()
    let artist = $('.col1-2-1').find('h2').text()
    let album = $('.col1-2-1').find('h3').text()

    lyric = replaceAll(lyric, '<br>', '\n');

    return { lyric, song, artist, album };
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}