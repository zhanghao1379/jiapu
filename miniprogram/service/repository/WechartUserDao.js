const COLLECTION_TYPE = "wechart-user";
let WechartUserEntity;
function WechartUserDao() {
  this.db = wx.cloud.database();
  
  WechartUserEntity = require("WechartUserEntity");
};

WechartUserDao.prototype.insert = function (e) {
 
     const user = {
       rootId: e.rootId,
       nickName: e.nickName,
       clansmanId: e.clansmanId
     };
    return this.db.collection(COLLECTION_TYPE).add({
      data: user
    }).then(res => {
      e._id = res._id;
      return e;
    });
};

WechartUserDao.prototype.update = function (id,values) {

  return this.db.collection("wechart-user").doc(id)
  .update({data:values}).then(res => {
    console.log("WechartUserDao.update", res.stats);
    return res.stats.updated;
    });
};

WechartUserDao.prototype.selectOne= function (where) {
  
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

/**
 * 把记录row转换为entity，便于业务处理
 */
const row2entity = function (row) {

  return WechartUserEntity.of(row);
};


module.exports = WechartUserDao;