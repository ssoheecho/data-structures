## week 01

### assignment: 
Using the starter code below, make a request for each of the ten AA "Meeting List Agenda" pages for Manhattan.
```javascript
// npm install request
// mkdir data

var request = require('request');
var fs = require('fs');

request('https://parsons.nyc/thesis-2020/', function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync('/home/ec2-user/environment/data/thesis.txt', body);
    }
    else {console.log("Request failed!")}
});
```

"Meeting List Agenda" pages:
```javascript
https://parsons.nyc/aa/m01.html  
https://parsons.nyc/aa/m02.html  
https://parsons.nyc/aa/m03.html  
https://parsons.nyc/aa/m04.html  
https://parsons.nyc/aa/m05.html  
https://parsons.nyc/aa/m06.html  
https://parsons.nyc/aa/m07.html  
https://parsons.nyc/aa/m08.html  
https://parsons.nyc/aa/m09.html  
https://parsons.nyc/aa/m10.html   
```

******************

For this assignment, I decided to put all of the pages into an array:
```javascript
var urls = [
    "https://parsons.nyc/aa/m01.html",  
    "https://parsons.nyc/aa/m02.html",  
    "https://parsons.nyc/aa/m03.html",  
    "https://parsons.nyc/aa/m04.html",  
    "https://parsons.nyc/aa/m05.html",  
    "https://parsons.nyc/aa/m06.html",  
    "https://parsons.nyc/aa/m07.html",  
    "https://parsons.nyc/aa/m08.html",  
    "https://parsons.nyc/aa/m09.html",  
    "https://parsons.nyc/aa/m10.html",  
    ]
    
```
then used the ```.forEach()``` method to iterate through each url and make the request. 

I also split each of the url by '/' to extricate the last part of it to use as the name of the file I was creating:
```javascript
let splitURL = url.split("/");
let fileName = splitURL[splitURL.length - 1]
```
