 
const request = require('request');

function getGeoCoding(address , callback) {
 const url =`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=pk.eyJ1IjoiYWhtZWQyODAiLCJhIjoiY2wwOWFpcnBhMDU3ajNkcWY1cWwxODBmNSJ9.Hn1a1dFwjHh_LoTDJdBqbQ&limit=1`
 // intead of get responce i can destruct body 
 request({url , json:true} , (error , {body}= {} ) => {
   if(error) {
    callback('unable to connect to location', undefined);
   }
   else if(body.features.length===0) {
     callback('Please specify a valid location')
   }
   else {
     callback(undefined , {
       longitude : body.features[0].center[0],
       latitude:body.features[0].center[1],
       location : body.features[0].place_name
     })
   }
 })
}


module.exports = {
  getGeoCoding
}
 