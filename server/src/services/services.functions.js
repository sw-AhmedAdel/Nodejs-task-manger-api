const validator = require('validator');


function checkpasswodLength(password) {
 if(password.length < 6) {
   return true
  }else 
  return false;
}

function checkpasswodWords(password){
if(password.includes("password")) {
   return true;
  }else 
  return false;
}

function checkEmail(email) {
if(validator.isEmail(email)){
  return true;
 }else 
   return false;
}

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0;
function getPagination(query) {
  const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
  const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
  const skip = (page - 1) * limit;
  return {
    skip,
    limit,
  };
}



module.exports = {
  checkEmail,
  checkpasswodLength,
  checkpasswodWords,
  getPagination
}