function ClansmanEntity() {
  this.id;
  //性别
  this.gender;
  //姓名
  this.name;
  //生日
  this.birthday;
  //手机电话
  this.mobile;
  //居住地
  this.liveWhere;
  //近照
  this.recentPhotoURL;
  //爸爸
  this.fatherId;
  //妈妈
  this.motherId;
  //配偶
  this.mateIds = [];
  //哥哥姐姐 
  this.previousSiblingId = null;
  //弟弟妹妹
  this.nextSiblingId = null;
  //作为儿子排行
  this.childOrder;
  //第几世(所属层级，从1开始))
  this.height;

  //创建时间
  this.createTime = Date.now();

};
ClansmanEntity.of = function(o) {
  let e = new ClansmanEntity();
  e.id = o.id;
  e.name = o.name||null;
  e.gender = o.gender;
  e.mobile = o.mobile || null;

  e.birthday = o.birthday || null;
  e.liveWhere = o.liveWhere || null;
  
  e.recentPhotoURL = o.recentPhotoURL || null;
  e.fatherId = Object.ifNOU(o.fatherId,null);
  e.motherId = Object.ifNOU(o.motherId,null);
  e.mateIds = o.mateIds||[];
  e.previousSiblingId = o.previousSiblingId||null;
  e.nextSiblingId = o.nextSiblingId || null;
  e.childOrder = o.childOrder||0;
  e.createTime = o.createTime||null;
  e.height=o.height;
  return e;
};

//添加配偶
ClansmanEntity.prototype.addMateId = function(mid) {
  if (!this.mateIds) {
    this.mateIds = [];
  }
  this.mateIds.push(mid);
};
//删除配偶
ClansmanEntity.prototype.deleteMateId = function (mid) {
  if (this.mateIds) {

    for(let i=0;i<this.mateIds.length;i++){
      if(this.mateIds[i]===mid){
        this.mateIds.splice(i,1);  
        return true;
      }
    }
  }
  return false;
};

//加载父亲
ClansmanEntity.prototype.loadFather = function() {
  if (this.father) {
    return Promise.resolve(this.father);
  }
  if (!this.fatherId) return Promise.resolve(null);
  const ClansmanDao = require("ClansmanDao");
  const dao = new ClansmanDao();
  return dao.selectOne({
    id: this.fatherId
  }).then(father => {
    this.father = father;
    return father;
  });
};
//加载母亲
ClansmanEntity.prototype.loadMother = function() {
  if (this.mother) {
    return Promise.resolve(this.mother);
  }
  if (!this.motherId) return Promise.resolve(null);
  const ClansmanDao = require("ClansmanDao");
  const dao = new ClansmanDao();
  return dao.selectOne({
    id: this.motherId
  }).then(mother => {
    this.mother = mother;
    return mother;
  });
};
//加载配偶
ClansmanEntity.prototype.loadMates = function() {
  if (this.mates) {
    return Promise.resolve(this.mates);
  }
  if (!this.mateIds || this.mateIds.length === 0) {
    return Promise.resolve([]);
  }
  const ClansmanDao = require("ClansmanDao");
  const dao = new ClansmanDao();
  return dao.selectMates(this.mateIds).then(mates => {
    this.mates = mates;
    return mates;
  });
};
//加载子女
ClansmanEntity.prototype.loadChildren = function() {
  if (this.children) {
    console.log("hahahha");
    return Promise.resolve(this.children);
  }
  const ClansmanDao = require("ClansmanDao");
  const dao = new ClansmanDao();
  if (this.gender) {
    return dao.selectChildren({
      fatherId: this.id
    }).then(children => {
      this.children = children;
      return this.children;
    });
  } else {
    return dao.selectChildren({
      motherId: this.id
    }).then(children => {
      this.children = children;
      return this.children;
    });
  }
};

module.exports = ClansmanEntity;