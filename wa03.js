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

// // geocode addresses
let meetingsData = [];
// get our addresses from json created from week2
let addresses = fs.readFileSync('/home/ec2-user/environment/data-structures/data/zone07.json');
addresses = JSON.parse(addresses); // need to parse json after loaded 
// the json includes duplicate addresses, with a total of 53 addresses
// get rid of duplicates by turning the array into a set and back to array
let uniqueAddresses = [...new Set(addresses)];
console.log(uniqueAddresses);
// 27 with the duplicates removed
console.log(uniqueAddresses.length)

//eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(uniqueAddresses, function(value, callback) {
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
        // console.log(tamuGeo);
        // FeatureMatchingResultType: 'Success'
        console.log(tamuGeo['FeatureMatchingResultType'], apiRequest);
        
        // for loop not needed
        let info = {
            streetAddress: tamuGeo['InputAddress']["StreetAddress"],
            latLong: {
                lat: tamuGeo['OutputGeocodes'][0]["OutputGeocode"]["Latitude"],
                long: tamuGeo['OutputGeocodes'][0]["OutputGeocode"]["Longitude"]
            }
        }
        
        meetingsData.push(info);
    });

    // sleep for a couple seconds before making the next request
    setTimeout(callback, 2000);
}, function() {
    fs.writeFileSync('data/first.json', JSON.stringify(meetingsData));
    console.log('*** *** *** *** ***');
    console.log(`Number of meetings in this zone: ${meetingsData.length}`);
});