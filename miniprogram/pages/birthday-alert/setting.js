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
    service.paginationListForBirthdayAlert(1,100).then(list=>{
      console.log(list);
        this.setData({list});
    })
  },
})