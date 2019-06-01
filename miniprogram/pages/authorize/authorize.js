const app=getApp();
Page({

  /**
   * Page initial data
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },
  handleConfirmBtnTap:function(evt){
    console.log(evt);
    let rawData=evt.detail.rawData;
    if(rawData){
     
      wx.redirectTo({
        url: '/pages/welcome/welcome'
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '你没有同意授权，请关闭小程序，欢迎再次使用。',
        showCancel:false
        
      })
    }
      
     
  }
 
})