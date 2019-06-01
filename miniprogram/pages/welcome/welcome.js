const app = getApp();
const service = new App.ClansmanService();

Page({

  data: {
    showPage: false,
    nickName: "",
    avatar: ""
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    app.getUserInfo().then(user => {
      console.log("user",user);
      //是否已有家谱树
      this.hasClanstree(user).then(yes=>{
       
          if(yes){
            wx.switchTab({
              url: '/pages/index/index'
            })
          }else{
             //否则展示欢迎界面  
            this.setData({
              showPage: true,
              nickName: user.nickName,
              avatar: user.avatarUrl
            });
          }
      });
      
    });
  },
  /**是否已有家谱树 */
  hasClanstree: function(user) {
    return service.hasClanstree(user);
  },

  handlecreateMyClantreeBtnTap: function(evt) {
    wx.redirectTo({
      url: '/pages/mine/add-self/add-self'
    });
  }





})