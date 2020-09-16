var fs = require('fs');
var cheerio = require('cheerio');

// load the thesis text file into a variable, `content`
// this is the file that we created in the starter code from last week
var content = fs.readFileSync('data/m07.html');

// load `content` into a cheerio object
var $ = cheerio.load(content);

// regex test
var pattern = /[-]/
var addresses = [];
// print (to the console) street address
$("td[style='border-bottom:1px solid #e3e3e3; width:260px']").each(function(i, elem) {
    addresses.push($(elem).html().split('<br>')[2].split(",")[0].trim());
});

addresses.forEach((elem, index) => {
    if(pattern.test(elem)) {
        addresses[index] = elem.split("-")[0].trim();
    }
});

console.log(addresses);

// write the street addresses to a text file
// var thesisTitles = ''; // this variable will hold the lines of text

// $('.project .title').each(function(i, elem) {
//     thesisTitles += ($(elem).text()).trim() + '\n';
// });

fs.writeFileSync('data/zone07_1.txt', JSON.stringify(addresses));