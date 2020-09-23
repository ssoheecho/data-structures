## week 02

### [assignment](https://github.com/visualizedata/data-structures/blob/master/weekly_assignment_02.md):
Based on the files created from last week's assignment, modify the below starter code to extract just the street addresses from one of the files:
```javascript
// npm install cheerio

var fs = require('fs');
var cheerio = require('cheerio');

// load the thesis text file into a variable, `content`
// this is the file that we created in the starter code from last week
var content = fs.readFileSync('data/thesis.txt');

// load `content` into a cheerio object
var $ = cheerio.load(content);

// print (to the console) names of thesis students
$('h3').each(function(i, elem) {
    console.log($(elem).text());
});

// write the project titles to a text file
var thesisTitles = ''; // this variable will hold the lines of text

$('.project .title').each(function(i, elem) {
    thesisTitles += ($(elem).text()).trim() + '\n';
});

fs.writeFileSync('data/thesisTitles.txt', thesisTitles);
```

******************

Looking through the html, I realized that the street addresses were nested under ```<td>``` tags with ```style='border-bottom:1px solid #e3e3e3; width:260px'``` styling.
Using cheerio, I parsed through the html to get the tags I needed. It returned 53 similar  ```<td>``` tags:
```html
<td style="border-bottom:1px solid #e3e3e3; width:260px" valign="top">
    <h4 style="margin:0;padding:0;">Jan Hus Church</h4><br />
	<b>OUR PRIMARY PURPOSE - </b><br />
	351 East 74th Street, 2nd Floor Kitchen, 
	<br />(Betw. 1st & 2nd Avenues) 10021
	<br />
	<br />
                        
    <div class="detailsBox"> 
        Women's Meeting. 
    </div>
</td>
```
Since the street address was the third element after the ```<br>``` tags, I used the following code to extract it:
```javascript
let address = $(elem).html().split('<br>')[2].split(",")[0].trim()
```
It splits the ```<td>``` in by ```<br>``` tags, fetches the street address, (which is 351 East 74th Street, 2nd Floor Kitchen). Since we don't need the , 2nd Floor Kitchen, we split this string again by "," and access the first element, the information we need. Finally, we call ```trim()``` to remove whitespace from both sides of the string.

Logging to the console, I noticed that some of the street addresses had a reverse order. The number address that I needed was the second element:
```html
<td style="border-bottom:1px solid #e3e3e3; width:260px" valign="top">
    <h4 style="margin:0;padding:0;"></h4><br />
	<b>ROOSEVELT ISLAND SERENITY - </b><br />
	Church of the Good Shepard, 543 Main St., Basement 10044, 
						
	<br />
	<br />
                         
	<span style="color:darkblue; font-size:10pt;">
        <img src="../images/wheelchair.jpg" alt="Wheelchair Access" width="20" vspace="5" hspace="10" align="absmiddle"/>Wheelchair access
    </span>
</td>
```

Since all of the street addresses here started with numbers, I decided to match the string against a regex pattern:
```javascript
var numberCheck = /^[0-9]/ 

if(numberCheck.test(address)) {
    addresses.push($(elem).html().split('<br>')[2].split(",")[0].trim());
} else {
    addresses.push($(elem).html().split('<br>')[2].split(",")[1].trim());   
}

```
Then I saw that some street addresses had addtional information after "-":
```html
<tr style="margin-bottom:10px">
    <td style="border-bottom:1px solid #e3e3e3; width:260px" valign="top">
        <h4 style="margin:0;padding:0;">Lenox Hill Neighborhood House</h4><br />
			<b>SUNDAY ON 70TH - Sunday On 70th</b><br />
				331 E 70th St, 
			<br />(Betw 1st & 2nd Avenues) NY 10021
			<br />
			<br />
</td>
```
To troubleshoot this, I wrote another regex pattern to test it against all the street addresses once they have been pushed to the array:
```javascript
var specialCharCheck = /[-]/

addresses.forEach((elem, index) => {
    if(specialCharCheck.test(elem)) {
        addresses[index] = elem.split("-")[0].trim();
    }
});

```

I think I might have overfitted my code to this specific file, I will probably have to revisit this to make sure that it works against all the other files as well.

Then finally, I stringified my array and saved it as a json file:
```javascript
fs.writeFileSync('../data/zone07.json', JSON.stringify(addresses));
```

