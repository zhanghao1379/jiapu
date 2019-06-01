const fill0 = function (n) {
  return n > 9 ? String(n) : '0' + n;
};
Date.getBirth=function(date){
  if(!date){
      return null;
  }
  if(typeof date==="string"){
    date=new Date(Date.parse(date));
  }
  return (date.getMonth()+1)*100+date.getDate();
}
Date.formatTime = function (date) {
  return [date.getFullYear(),
  date.getMonth() + 1,
  date.getDate()]
    .map(fill0)
    .join('-')
    + ' '
    + [date.getHours(),
    date.getMinutes(),
    date.getSeconds()].map(fill0).join(':');
};
Date.formatDate = function (date) {

  return [date.getFullYear(),
  date.getMonth() + 1,
  date.getDate()]
    .map(fill0)
    .join('-');
};
Date.betweenDay=function(a,b){
  let betweenMS=a.getTime()-b.getTime();
  return Math.floor(Math.abs(betweenMS)/(24*60*60*1000));
}

Object.ifUndefined=function(o,d){
  return typeof o==="undefined"?d:o;
}
/**
 * 如果o是null或者undefined，则默认为d
 */
Object.ifNOU=function (o, d) {
  return typeof o === "undefined"||o===null ? d : o;
};



String.trim = function (s) {
  if (typeof s === "undefined" || s === null) {
    return null;
  }
  if (typeof s !== "string") {
    s = String(s);
  }
  return s.trim();
};
String.uuid=require("uuid");

module.exports={

};

