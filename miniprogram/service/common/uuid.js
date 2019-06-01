const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
const uuid = function(len, radix) {
  let chars=CHARS;
  const uuid = [];
    
  radix = radix || chars.length;

  if (len) {
    for (let i = len; i-- > 0; uuid[i] = chars[0 | Math.random() * radix]);
    return uuid.join("");
  }
  
  for (let i =0,r; i < 32; i++) {
      r = 0 | Math.random() * 16;
    uuid[i] = chars[(i == 16) ? (r & 0x3) | 0x8 : r];
  }
  return uuid.join('');
};

module.exports = uuid;