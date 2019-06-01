const app = getApp();

Page({
  data: {
    
  },
  onLoad: function () {
    app.getUserInfo().then(user=>{
      this.setData({
        userInfo:user
      })
    })
  }
});
