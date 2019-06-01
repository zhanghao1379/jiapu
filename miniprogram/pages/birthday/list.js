const app = getApp();
const service = new App.ClansmanService();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },
  onLoad:function(){
    service.listRecentBirthday().then(list=>{
      list = list.map(entity2vo);
      this.setData({list})
    });
  }


});

const entity2vo=function(e){
  let name=e.name;
  let birthday=e.birthday;
  let now=new Date();
  let birthdayDate=new Date(Date.parse(birthday));
  birthdayDate.setFullYear(now.getFullYear());
  let whenDay=Date.betweenDay(birthdayDate,now);
  let when=null;
  if (whenDay===0){
    when="今天";
  }else{
    when=whenDay+"天后";
  }
  

  return {
    name,
    birthday,
    when
  }
};