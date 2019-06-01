const app = getApp();
const service = new App.ClansmanService();
Page({
  data: {
    roots:[]
    
  },
  onLoad:function(options){
    
  },
  onShow: function () {
    //加载老祖宗们
    service.listRoots().then(roots => {
      console.log("roots", roots);
      if (roots.length) {
          console.log(roots)
        this.setData({ roots });
      } else {
        //跳转添加页面
        wx.redirectTo({
          url: '/pages/mine/add-self/add-self'
        })
      }
    });
  }
  
})
