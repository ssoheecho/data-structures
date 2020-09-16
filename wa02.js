var fs = require('fs');
var cheerio = require('cheerio');

// load the correct zone html
var content = fs.readFileSync('data/m07.html');

// load `content` into a cheerio object
var $ = cheerio.load(content);

// regex test
// for checking that the addresses start with #
var numberCheck = /^[0-9]/ 
// for cleaning addresses with additional info
var specialCharCheck = /[-]/

// array to store the addresses
var addresses = [];

// print (to the console) street address
$("td[style='border-bottom:1px solid #e3e3e3; width:260px']").each(function(i, elem) {
    let address = $(elem).html().split('<br>')[2].split(",")[0].trim()
    
    // making sure that the addresses start with numbers
    if(numberCheck.test(address)) {
        addresses.push($(elem).html().split('<br>')[2].split(",")[0].trim());
    } else {
        addresses.push($(elem).html().split('<br>')[2].split(",")[1].trim());   
    }
});

// cleaning for addresses with additional information after - 
addresses.forEach((elem, index) => {
    if(specialCharCheck.test(elem)) {
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