const app=getApp();
const service = new App.ClansmanService();
const Assert = App.Assert;
Page({

  /**
   * Page initial data
   */
  data: {
    genderArray:"女,男".split(","),
    father:null,
    mother:null,
    myself:{
      name: '朱旭尧',
      mobile: "18627356847",
      gender:0,
      birthday: Date.formatDate(new Date()),
      liveWhere: "河南省洛阳市孟津县",
      recentPhotoURL: null
    },
    mates:[],
    children: []

  },
  onLoad:function(options){
    //获取微信账号性别
    app.getUserInfo().then(u=>{
      console.log(u);
      //默认男性(未知默认男性)
      let myselfGender=1;
      //女性
      if(u.gender===2){
        myselfGender=0;
      }
      //国家省市
      let liveWhere=[];
      liveWhere.push(u.country||"");
      liveWhere.push(u.province||"");
      liveWhere.push(u.city||"");
      this.setData({
        "myself.gender": myselfGender,
        "myself.liveWhere":liveWhere.join("")
      });
    });
  },
  handleSelectRecentPhoto: function () {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
     
        this.setData({
          "myself.recentPhotoURL":tempFilePaths[0]
        });
      }
    });
  },
  handleBirthDayChange: function (evt) {
    let newValue = evt.detail.value;
    this.setData({
      "myself.birthday": newValue      
      
    })
  },
  handleGenderChange: function (evt) {
    let newValue = evt.detail.value;
    this.setData({
      "myself.gender": newValue
      
    })
  },
  handleAddMateBtnTap:function(evt){
    wx.navigateTo({
      url: '/pages/clansman/add-mate/add-mate'
    });
  },
  handleDeleteChildBtnTap: function (evt) {
    const order = evt.target.dataset.order;
    let children = this.data.children;
    children.splice(order,1);
    this.setData({
      children: children
    });
  },
  handleAddChildBtnTap: function (evt) {
    
    if(this.data.myself.gender===1){
      wx.navigateTo({
        url: '/pages/clansman/add-child/father-add-child'
      });
    }else{
      wx.navigateTo({
        url: '/pages/clansman/add-child/mother-add-child'
      });
    }
    
  },
  handleFormSubmit: function (evt) {
    const formData = evt.detail.value;
    formData.recentPhotoURL = this.data.recentPhotoURL;
    const ao = validateFormData2ao(formData);
    if (ao) {
      ao.father=this.data.father;
      ao.mother=this.data.mother;
      ao.mates=this.data.mates;
      ao.children=this.data.children;
      wx.showLoading({
        title: '加载中',
      });
      service.addMyself(ao).then(myself=>{
        wx.hideLoading();
        wx.showToast({
          title: "录入成功!"
        });
       
        setTimeout(function(){
          wx.switchTab({
            url: '/pages/index/index'
          })
        },500);
        
      }).catch(err=>{
        wx.hideLoading();
        App.handleError(err);
      })
    }
  },
  //母亲回调
  onMotherReady:function(mother){
    this.setData({
      mother: mother
    });
  },
  //父亲回调
  onFatherReady:function(father){
    this.setData({
      father:father
    });
  },
 //添加配偶回调
  onMateAddReady: function (mate) {
    let mates=this.data.mates;
    let mateOrder=mate.mateOrder;
    //插入自定位置
    mates.splice(mateOrder,0,mate);
   
    this.setData({mates});
  },
  /*
  *修改配偶回调
  *@param which 修改的是第几个
  */
  onMateModReady: function (which,mate) {
    let mates = this.data.mates;
    let mateOrder = mate.mateOrder;
    //如果修改了位置
    if(which!=mateOrder){
      //先删除
      mates.splice(which, 1);
      //再插入
      mates.splice(mateOrder,0,mate);
    }else{
      //直接替换
      mates[which]=mate;
    }
    this.setData({ mates });
  },
  //配偶回调
  onMateDeleteReady: function (which) {
    let mates = this.data.mates;
    //删除
    mates.splice(which, 1);
    this.setData({ mates });
  },
  //子女回调
  onChildReady: function (child) {
    let children=this.data.children;
    children.push(child);
    this.setData({children});
  }
});


const validateFormData2ao = function (data) {
  try {
    let name = Assert.stringNotBlank("我的姓名必须填写", data.name);
    Assert.isTrue("我的姓名应该两个字或以上", name.length >= 2);
    let gender=data.gender;
    let birthday = data.birthday;

    let mobile = Assert.stringNotBlank("您的手机号码必须填写",data.mobile);
    Assert.isMobileNumber("手机号码格式不正确", mobile);
    
    let liveWhere = String.trim(data.liveWhere);
    let recentPhotoURL = String.trim(data.recentPhotoURL);


    return {
      name,
      gender,
      birthday,
      mobile,
      recentPhotoURL,
      liveWhere

    };
  } catch (e) {
    App.handleError(e);

  }
  return null;
};

