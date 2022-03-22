

const {forecast} = require('../../services/forecast');
const {getGeoCoding} =require('../../services/gecoding');

function getWeahter(req , res) {
  if(!req.query.address) {
    return res.status(400).json({
      error:"addess must be defined"
    })
  }

  const addess = req.query.address;
  
  getGeoCoding(addess , (error , {longitude, latitude, location} ={}) => {
   if(error) {
    return res.status(400).json({error})
   }
 
    forecast(longitude ,latitude, (error , forecastDate) => {
     if(error) {
      return res.status(400).json({error})
     }
   
    return res.status(200).json({
        forecast:forecastDate,
        location ,
        addess,
      })
     
    })
   
  })
}

module.exports= {
  getWeahter
}