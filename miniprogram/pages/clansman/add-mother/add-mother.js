let fromPage = null;
const Assert = App.Assert;
Page({

  data: {
    showDeleteBtn: false,
    name: '伏雨彤',
    birthday: Date.formatDate(new Date()),
    recentPhotoURL: null,
    mobile: "13206152367",
    liveWhere: "四川省德阳市旌阳区"

  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let pages = getCurrentPages();

    //获取上一个page
    fromPage = pages[pages.length - 2];
    //更新上一个page的mother
    if (fromPage && fromPage.data.mother) {
      console.log(fromPage.data.mother)

      this.setData(fromPage.data.mother);
      this.setData({
        showDeleteBtn: true
      });
    }
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
  handleBirthDayChange: function (evt) {
    let newValue = evt.detail.value;
    this.setData({
      birthday: newValue
    })
  },
  handleFormSubmit: function (evt) {
    const formData = evt.detail.value;
    formData.recentPhotoURL = this.data.recentPhotoURL;
    const ao = validateFormData2ao(formData);
    if (ao) {
      notifyFromPage(ao);
    }
  },
  handleDeleteBtnTap: function (evt) {
    wx.showModal({
      title: "警告",
      content: "确认删除母亲?",
      showCancel: true,
      success: res => {
        if (res.confirm) {
          notifyFromPage(null);
          wx.showToast({
            title: "删除母亲成功!"
          });
        }
      }
    });
  }
});

let notifyFromPage = function (father) {
  //回调
  if (fromPage && fromPage.onMotherReady) {

    fromPage.onMotherReady(father);
    wx.navigateBack();
  }
};

const validateFormData2ao = function (data) {
  try {
    let name = Assert.stringNotBlank("母亲姓名必须填写", data.name);
    Assert.isTrue("母亲姓名应该两个字或以上", name.length >= 2);

    let birthday = data.birthday;

    let mobile = String.trim(data.mobile);
    if (mobile) {
      Assert.isMobileNumber("手机号码格式不正确", mobile);
    }
    let liveWhere = String.trim(data.liveWhere);
    let recentPhotoURL = String.trim(data.recentPhotoURL);


    return {
      name,
      birthday,
      gender:0,
      mobile,
      recentPhotoURL,
      liveWhere

    };
  } catch (e) {
    App.handleError(e);

  }
  return null;
};

