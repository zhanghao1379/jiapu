function WechartUserEntity(){
  //
  this.nickName;
  this.rootId=null;
  this.clansmanId=null;
};

WechartUserEntity.of=function(obj){
  const u = new WechartUserEntity();
  u.nickName=obj.nickName;
  u.rootId=obj.rootId;
  u.clansmanId = obj.clansmanId;
  u._id=obj._id;
  return u;
};

module.exports = WechartUserEntity;
