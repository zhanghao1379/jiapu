
const ClansmanDao = require("repository/ClansmanDao");
const WechartUserDao = require("repository/WechartUserDao");
const ClansmanEntity = require("repository/ClansmanEntity");
const WechartUserEntity = require("repository/WechartUserEntity");


function ClansmanService() {
  this.manDao = new ClansmanDao();
  this.userDao=new WechartUserDao();
};

ClansmanService.prototype.addMyself = function(ao) {
    const manDao = this.manDao;
    const allTasks = [];
    //1 添加父亲母亲
    const father = ao2entity(ao.father);
    const mother = ao2entity(ao.mother);
    const myself = ao2entity(ao);
    let currentHeight = 0;
    //rootID
    let rootId=null;

    if (mother != null && father != null) {
      father.addMateId(mother.id);
      mother.addMateId(father.id);
    }
    
    if (mother) {
      mother.height = currentHeight;
      mother.gender=false;
      allTasks.push(manDao.insert(mother));
      myself.motherId = mother.id;
      rootId=mother.id;
    }
    if (father) {
      father.height = currentHeight;
      father.gender = true;
      allTasks.push(manDao.insert(father));
      myself.fatherId = father.id;
      rootId = father.id;
    }

    //3 添加配偶
    const mates = ao.mates;

    //3.1 配偶深度
    
    
    if (mates.length) {
      for (let mate of mates) {
        mate = ao2entity(mate);
        //添加配偶关系

        mate.addMateId(myself.id);

        myself.addMateId(mate.id);
        mate.height = currentHeight;
        allTasks.push(manDao.insert(mate));
      }
    }
    //4 添加自己
    myself.height = currentHeight;
    allTasks.push(manDao.insert(myself));
    if (!rootId){
      rootId = myself.id;
    }
    //5 添加子女
    let children = ao.children;
    if (children) {
      console.log("children", children);
      children = children.map(ao2entity);
      currentHeight++;
      for (let i = 0, child, childrenCount = children.length; i < childrenCount; i++) {
        child = children[i];
        console.log(child);
        //处理父母关系
        if (myself.gender) {
          child.fatherId = myself.id;
          child.motherId = myself.mateIds[child.motherId];
        } else {
          child.motherId = myself.id;
          child.fatherId = myself.mateIds[child.fatherId];
        }
        //处理兄弟关系
        //不是第一个
        if (i !== 0) {
          child.previousSiblingId = children[i - 1].id;
        }
        //也不是最后一个
        if (i !== childrenCount - 1) {
          child.nextSiblingId = children[i + 1].id;
        }
        //处理子女顺序号
        child.childOrder = i;
        child.height = currentHeight;
        allTasks.push(manDao.insert(child));
      }
    }
    //添加rootId
  allTasks.push(getApp().getUserInfo().then(u=>{
      const wu = new WechartUserEntity();
      wu.nickName =u.nickName;
      wu.rootId=rootId;
      wu.clansmanId=myself.id;
      return this.userDao.insert(wu);
  }));
  
    
    return Promise.all(allTasks).then(res=>{
      return myself;
    });
};
ClansmanService.prototype.deleteClansman=function(id){
  return this.manDao.deleteById(id);
}
/**
 * 添加母亲
 */
ClansmanService.prototype.addMother = function (id,mother) {
  mother = ao2entity(mother);
  //查找当前族人
  return this.manDao.load(id).then(cm=>{
    //是否有父亲
    return cm.loadFather().then(f=>{
      if (f) {
        //级联父亲
        mother.addMateId(f.id);
        f.addMateId(mother.id);
        console.log("fuq",f);
        //更新父亲
        this.manDao.update(f.id,{mateIds:f.mateIds});
        //和父亲深度一致
        mother.height = f.height;
      }else{
        //新增母亲
        mother.height=cm.height-1;
        this.updateRootId(mother.id);
      }
      return this.manDao.insert(mother).then(m => {
        cm.motherId = m.id;
        
        return this.manDao.update(id, { motherId: m.id });
      });
    });
        
  })
  
};
ClansmanService.prototype.updateRootId = function (id) {
  return getApp().getUserInfo().then(u=>{
      return this.userDao.selectOne({nickName:u.nickName}).then(wu=>{
         return this.userDao.update(wu._id,{
           rootId:id 
        });
      });
  });
};

/**
 * 添加父亲
 */
ClansmanService.prototype.addFather = function (id,father) {
  father = ao2entity(father);
  //查找当前族人
  return this.manDao.load(id).then(cm => {
     //是否有母亲
    return cm.loadMother().then(m=> {
      if (m) {
        //级联母亲
        father.addMateId(m.id);
        m.addMateId(father.id);
        //更新母亲
        this.manDao.update(m.id, { mateIds: m.mateIds });
   
      }
   
      //新增父亲
      return this.manDao.insert(father).then(f=>{
        cm.fatherId=f.id;
        this.updateRootId(f.id);
        return this.manDao.update(id,{fatherId:f.id});
      });
    });

  });
};
ClansmanService.prototype.addMate = function (_id,mate) {
  mate = ao2entity(mate);
  //查找当前族人
  return this.manDao.load(_id).then(cm => {
    mate.addMateId(cm.id);
    
    return this.manDao.insert(mate).then(mate=>{
      cm.addMateId(mate.id);
      //更新族人
      this.manDao.update(_id,{mateIds:cm.mateIds});
      return mate;
    });
  });

};
/**
 * 删除配偶
 */
ClansmanService.prototype.deleteMate = function (id,mateId) {
  this.manDao.deleteById(id).then(yes=>{
    if(yes){
      this.manDao.load(id).then(cm => {
        cm.deleteMateId(mate.id);
        //更新族人
        this.manDao.update(id, { mateIds: cm.mateIds });
      });
    }
  });
};
ClansmanService.prototype.addChild = function (id,child) {
  child = ao2entity(child);
  //查找目前所有儿子
  return this.manDao.load(id).then(cm => {
      return cm.loadChildren().then(children=>{
          children=children||[];
          child.childOrder=children.length;
          if(children.length>0){
            let lastChild=children[children.length-1];
            child.previousSiblingId=lastChild.id;
            //更新最后的子女
            this.manDao.update(lastChild._id,{nextSiblingId:child.id});
          }
          return this.manDao.insert(child);
      });
  });
};
ClansmanService.prototype.deleteChild = function (id) {
  //return this.manDao.insert(child);
}
/**
 * 加载所有老祖宗
 */
ClansmanService.prototype.listRoots = function(id) {
  return getApp().getUserInfo().then(u=>{
   
    return this.userDao.selectOne({nickName:u.nickName}).then(wu=>{
      if(wu){
      return this.manDao.selectMany({
        id: wu.rootId
      });
      }else{
        return [];
      }
    });
  });
 
 
};



/**
 * 加载一个族人信息
 * 级联加载全部
 */
ClansmanService.prototype.load = function(id) {
  return this.manDao.load(id);
};
/**
 * 用户是否拥有树
 */
ClansmanService.prototype.hasClanstree = function(user) {
  return this.manDao.count().then(c => {
    return c > 0;
  });
};
ClansmanService.prototype.loadMyself = function () {
  return getApp().getUserInfo().then(u=>{
    return this.userDao.selectOne({nickName:u.nickName}).then(wu=>{
     
        return this.manDao.selectOne({id:wu.clansmanId});
      
    });
  });
}

/**
 * 修改族人信息
 */
ClansmanService.prototype.modify = function(id, ao) {
  console.log("arguments", arguments);
  //必须项
  const e = {};
  if ("name" in ao) {
    e.name = ao.name;
  }
  if ("mobile" in ao) {
    e.mobile = ao.mobile;
  }
  if ("gender" in ao) {
    e.gender = ao.gender === 1;
  }



  //可选项
  if ("birthday" in ao) {
    e.birthday = ao.birthday;
  }
  if ("liveWhere" in ao) {
    e.liveWhere = ao.liveWhere;
  }
  if ("recentPhotoURL" in ao) {
    e.recentPhotoURL = ao.recentPhotoURL;
  }


  if ("fatherId" in ao) {
    e.fatherId = ao.fatherId;
  }
  if ("motherId" in ao) {
    e.motherId = ao.motherId;
  }

  if ("mateIds" in ao) {
    e.mateIds = ao.mateIds || [];
  }

  if ("previousSiblingId" in ao) {
    e.previousSiblingId = ao.previousSiblingId;
  }

  if ("nextSiblingId" in ao) {
    e.nextSiblingId = ao.nextSiblingId;
  }

  if ("childOrder" in ao) {
    e.childOrder = ao.childOrder || 0;
  }
  
  return this.manDao.update(id,e);

};
/**
 * 最近生日家人
 */
ClansmanService.prototype.listRecentBirthday = function () {
    let now=new Date();
    now=(now.getMonth()+1)*100+now.getDate();
    return this.manDao.selectByBirthdayGreateThan(now);
};
/**
 * 分页生日提醒列表
 */
ClansmanService.prototype.paginationListForBirthdayAlert = function (pageNo,pageSize) {
  return this.manDao.selectPagination(pageNo,pageSize);
}






ClansmanService.prototype.modify1 = function (id, ao) { };
ClansmanService.prototype.modify2 = function (id, ao) { };
const ao2entity = function (ao) {
  if (!ao) return null;
  const e = new ClansmanEntity();
  //必须项
  e.id = String.uuid();
  e.name = ao.name;
  e.mobile = ao.mobile;
  e.gender = ao.gender === 1;
  //可选项
  e.birthday = ao.birthday || null;

  e.liveWhere = ao.liveWhere || null;
  e.recentPhotoURL = ao.recentPhotoURL || null;
  e.fatherId = Object.ifNOU(ao.fatherId, null);
  e.motherId = Object.ifNOU(ao.motherId, null);
  e.mateIds = ao.mateIds || [];
  e.previousSiblingId = ao.previousSiblingId || null;
  e.nextSiblingId = ao.nextSiblingId || null;
  e.childOrder = ao.childOrder || 0;
  e.createTime = ao.createTime || Date.now();
  return e;
};

module.exports = ClansmanService;