### week 01

#### assignment: 
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
