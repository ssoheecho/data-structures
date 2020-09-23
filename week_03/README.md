## week 03

### [assignment](https://github.com/visualizedata/data-structures/blob/master/weekly_assignment_03.md):
Using the street addresses from last week's assignment, call the Texas A&M Geoservices API and create an array of JSON objects with street address, longitude, and latitude information. Save the results to a json file.
```javascript
"use strict"

// dependencies
const fs = require('fs'),
      querystring = require('querystring'),
      request = require('request'),
      async = require('async'),
      dotenv = require('dotenv');

// TAMU api key
dotenv.config();
const API_KEY = process.env.TAMU_KEY;
const API_URL = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx'

// geocode addresses
let meetingsData = [];
let addresses = ["63 Fifth Ave", "16 E 16th St", "2 W 13th St"];

// eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(addresses, function(value, callback) {
    let query = {
        streetAddress: value,
        city: "New York",
        state: "NY",
        apikey: API_KEY,
        format: "json",
        version: "4.01"
    };

    // construct a querystring from the `query` object's values and append it to the api URL
    let apiRequest = API_URL + '?' + querystring.stringify(query);

    request(apiRequest, function(err, resp, body) {
        if (err){ throw err; }

        let tamuGeo = JSON.parse(body);
        console.log(tamuGeo['FeatureMatchingResultType'], apiRequest);
        meetingsData.push(tamuGeo);
    });

    // sleep for a couple seconds before making the next request
    setTimeout(callback, 2000);
}, function() {
    fs.writeFileSync('data/first.json', JSON.stringify(meetingsData));
    console.log('*** *** *** *** ***');
    console.log(`Number of meetings in this zone: ${meetingsData.length}`);
});
```

******************

First, I used ```readFileSync()``` to get all the addresses from the previous assignment:
```javascript
let addresses = fs.readFileSync('/home/ec2-user/environment/data-structures/data/zone07.json');
addresses = JSON.parse(addresses); 
```

I decided to remove all the duplicate addresses (there were 17 351 East 74th Street). I turned my addresses into a set and then copied them back the addresses into an array, which resulted in 27 unique street addresses:
```javascript
let uniqueAddresses = [...new Set(addresses)];
console.log(uniqueAddresses);
```

The code within ```async.eachSeries()``` calls the API for each of the addresses in the uniqueAddresses array. The returned JSON object looks like this:
```javascript
[{"version":"4.10","TransactionId":"608e9dc3-a0de-4192-8c4b-70e7d71449e3","Version":"4.1","QueryStatusCodeValue":"200","FeatureMatchingResultType":"Success","FeatureMatchingResultCount":"1","TimeTaken":"0.1093743","ExceptionOccured":"False","Exception":"","InputAddress":{"StreetAddress":"2 W 13TH ST New York NY ","City":"New York","State":"NY","Zip":""},"OutputGeocodes":[{"OutputGeocode":{"Latitude":"40.7353701","Longitude":"-73.9945167","NAACCRGISCoordinateQualityCode":"00","NAACCRGISCoordinateQualityType":"AddressPoint","MatchScore":"97.3372781065089","MatchType":"Relaxed;Soundex","FeatureMatchingResultType":"Success","FeatureMatchingResultCount":"1","FeatureMatchingGeographyType":"Parcel","RegionSize":"0","RegionSizeUnits":"Meters","MatchedLocationType":"LOCATION_TYPE_STREET_ADDRESS","ExceptionOccured":"False","Exception":"","ErrorMessage":""}}]}]
```

The information that we need is in the keys "InputAddress" and "OutputGeocodes". So I constructed an object based on the data I got from the API and pushed all of them in an array. Finally, I stringfied the data and saved it into a json file.
```javascript
let meetingData = [];

...

let info = {
            streetAddress: tamuGeo['InputAddress']["StreetAddress"],
            latLong: {
                lat: tamuGeo['OutputGeocodes'][0]["OutputGeocode"]["Latitude"],
                long: tamuGeo['OutputGeocodes'][0]["OutputGeocode"]["Longitude"]
            }
        }
        
meetingsData.push(info);

...

fs.writeFileSync('../data/first.json', JSON.stringify(meetingsData));

```