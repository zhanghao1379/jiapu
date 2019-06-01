const COLLECTION_TYPE = "clansman";
const FileUploader = require("../common/FileUploader");
let ClansmanEntity=null;

function ClansmanDao() {
  this.db = wx.cloud.database();
  ClansmanEntity = require("ClansmanEntity");
  this.fileUploader=new FileUploader();
};

ClansmanDao.prototype.insert = function(e) {
  return new Promise((ok, fail) => {
    //上传近照
    let recentPhotoURL = String.trim(e.recentPhotoURL);

    if (recentPhotoURL) {
      this.fileUploader.uploadRecentPhoto(recentPhotoURL).then(ok).catch(fail);

    } else {
      ok(null);
    }
  }).then(cloudFileId => {


    const clansman = {
      id: e.id,
      name: e.name,
      gender: e.gender,
      birthday: e.birthday,
      liveWhere: e.liveWhere,
      mobile: e.mobile,
      recentPhotoURL: cloudFileId,
      fatherId: e.fatherId,
      motherId: e.motherId,
      mateIds: e.mateIds,
      previousSiblingId: e.previousSiblingId,
      nextSiblingId: e.nextSiblingId,
      childOrder: e.childOrder,
      height:e.height,
      createTime: e.createTime
    };
 
    clansman._birthday=Date.getBirth(clansman.birthday);
    
    console.log("dao",clansman);
    return this.db.collection(COLLECTION_TYPE).add({
      data: clansman
    }).then(res => {
      e._id = res._id;
      return e;
    });
  });


};



ClansmanDao.prototype.update = function(_id, map) {
  if(map.birthday){
    map._birthday = Date.getBirth(map.birthday);
  }
  return this.db.collection(COLLECTION_TYPE).doc(_id)
  .update({
    data:map
  }).then(res=>{
    console.log("res.stats",res.stats);
    return res.stats.updated;
  });
};

ClansmanDao.prototype.count = function () {
  return this.db.collection(COLLECTION_TYPE).count().then(res=>res.total);
};

ClansmanDao.prototype.deleteById = function(_id) {
  return this.db.collection(COLLECTION_TYPE).doc(_id)
    .remove().then(res => {
      console.log("res.stats", res.stats);
      return res.stats.updated;
    });
};

ClansmanDao.prototype.selectMates = function(idArray) {
  const _ = this.db.command;
  return this.db.collection(COLLECTION_TYPE)
    .where({
      id: _.in(idArray)
    }).get().then(res => {
      const rows = res.data;
      if (rows && rows.length) {
        return rows.map(row2entity);
      } else {
        return null;
      }
    });
};
ClansmanDao.prototype.load= function (_id) {
  return this.db.collection(COLLECTION_TYPE).doc(_id).get().then(res=>{
    
    const row = res.data;
    if (row) {
      return row2entity(row);
    } else {
      return null;
    }
  });
}
ClansmanDao.prototype.selectOne = function(where) {
  return this.db.collection(COLLECTION_TYPE)
    .where(
      where
    ).get().then(res => {
      const rows = res.data;
      if (rows && rows.length) {
        return row2entity(rows[0]);
      } else {
        return null;
      }
    });
};
ClansmanDao.prototype.selectChildren = function (where){
  return this.selectMany(where,[["childOrder","asc"]]);
}
ClansmanDao.prototype.selectMany = function(where, orderBys) {
  let query = this.db.collection(COLLECTION_TYPE)
    .where(where);
  if (orderBys) {
    
    for (let ob of orderBys) {
      
      query=query.orderBy(ob[0], ob[1] || "asc");
    }
  }
  
  return query.get().then(res => {
    const rows = res.data;
    if (rows && rows.length) {
      return rows.map(row2entity);
    } else {
      return [];
    }
  });
};
/**
 * 查找生日大于指定时间的族人
 */
ClansmanDao.prototype.selectByBirthdayGreateThan=function(bn){
  let _=this.db.command;
  return this.db.collection(COLLECTION_TYPE).where({
    _birthday:_.gte(bn)
  }).orderBy("_birthday","asc").limit(10).get().then(res=>{
    let rows=res.data;
    if (rows && rows.length) {
      return rows.map(row2entity);
    } else {
      return [];
    }
  });
};

ClansmanDao.prototype.selectPagination=function(pageNo,pageSize){
  let _ = this.db.command;
  return this.db.collection(COLLECTION_TYPE).where({
    birthday: _.neq(null)
  }).orderBy("name", "asc").skip((pageNo-1)*pageSize).limit(pageSize).get().then(res => {
    let rows = res.data;
    if (rows && rows.length) {
      return rows.map(row2entity);
    } else {
      return [];
    }
  });
};


/**
 * 把记录row转换为entity，便于业务处理
 */
const row2entity = function(o) {
  let e = new ClansmanEntity();
  e._id=o._id;
  e.id = o.id;
  e.name = o.name;
  e.gender = o.gender?1:0;
  e.mobile = o.mobile; 

  e.birthday = o.birthday;
  if(e.birthday){
    let birthdayDate=new Date(Date.parse(e.birthday));
    let _birthday=(birthdayDate.getMonth()+1)*100+birthdayDate.getDate();
    e._birthday=_birthday;
  }
  e.liveWhere = o.liveWhere;

  e.recentPhotoURL = o.recentPhotoURL;
  e.fatherId = o.fatherId;
  e.motherId = o.motherId;
  e.mateIds = o.mateIds;
  e.previousSiblingId = o.previousSiblingId;
  e.nextSiblingId = o.nextSiblingId;
  e.childOrder = o.childOrder;
  e.createTime = o.createTime;
  return e;
};


module.exports = ClansmanDao;