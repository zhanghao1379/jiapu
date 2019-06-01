const app = getApp();
let fromPage = null;
const Assert = App.Assert;
const service = new App.ClansmanService();
Page({

  data: {
    genderArray: "女,男".split(","),
    motherId: 0,
    gender: 0,
    name: '朱瑾萱',
    mobile: "18861715800",
    birthday: Date.formatDate(new Date()),
    liveWhere: "黑龙江省绥化地区青冈县",
    recentPhotoURL: null
  },
  onLoad: function (options) {
    let fatherId=options.fatherId;
    //如果传递了父亲id，则查找数据
    if(fatherId){
      service.load(fatherId).then(f=>{
        this.setData({
          motherArray: f.mates,
          fatherName:f.name,
          fatherId: fatherId
        });
      });
    }else{
      //尝试从前一个页面获取数据
      let pages = getCurrentPages();
      fromPage = pages[pages.length - 2];
      if (fromPage) {
        let father = fromPage.data.myself;
        let mates=fromPage.data.mates||[];
        mates=mates.map(m=>m.name);
        if(father){
          this.setData({
            motherArray: mates,
            fatherName: father.name,
            fatherId:father.id
          });
        }
      }
    }
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: "添加第1个子女"
    });
  },
  handleMotherChange:function(evt){
    let newValue = evt.detail.value;
    this.setData({
      "motherId": newValue
    })
  },
  handleSelectRecentPhoto: function () {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        this.setData({
          recentPhotoURL: tempFilePaths[0]
        });
      }
    });
  },
  handleGenderChange: function (evt) {
    let newValue = evt.detail.value;
    this.setData({
      "gender": newValue

    })
  },
  handleBirthDayChange: function (evt) {
    let newValue = evt.detail.value;
    this.setData({
      birthday: newValue
    })
  },
  handleFormSubmit: function (evt) {
    const formData = evt.detail.value;
    formData.recentPhotoURL = this.data.recentPhotoURL;
    formData.fatherId=this.data.fatherId;
    const ao = validateFormData2ao(formData);
    if (ao) {
      console.log("ao",ao);
      notifyFromPage(ao);
    }
  }

});

let notifyFromPage = function (child) {
  //回调
  if (fromPage && fromPage.onChildReady) {

    fromPage.onChildReady(child);
    wx.navigateBack();
  }
};

const validateFormData2ao = function (data) {
  try {

    let motherId = data.motherId;
    let fatherId=data.fatherId;
    let name = Assert.stringNotBlank("子女姓名必须填写", data.name);
    Assert.isTrue("子女姓名应该两个字或以上", name.length >= 2);
    let gender = data.gender;
    let birthday = data.birthday;

    let mobile = String.trim(data.mobile);
    if (mobile) {
      Assert.isMobileNumber("手机号码格式不正确", mobile);
    }
    let liveWhere = String.trim(data.liveWhere);
    let recentPhotoURL = String.trim(data.recentPhotoURL);
    

    return {
      name,
      gender,
      birthday,
      mobile,
      recentPhotoURL,
      liveWhere,
      motherId,
      fatherId
    };
  } catch (e) {
    App.handleError(e);

  }
  return null;
};