let fromPage = null;
const Assert = App.Assert;
Page({

    data: {
        showDeleteBtn: false,
        name: '',
        birthday: Date.formatDate(new Date()),
        mobile: "",
        liveWhere: "",
        recentPhotoURL: null,

    },
    /**
     * Lifecycle function--Called when page load
     */
    onLoad: function (options) {
        let pages = getCurrentPages();

        //获取上一个page
        fromPage = pages[pages.length - 2];
        //更新上一个page的fatherId
        if (fromPage && fromPage.data.father) {
            console.log(fromPage.data.father)

            this.setData(fromPage.data.father);
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
            birthday: newValue,
            birthDayAlert: true
        })
    },
    handleBirthDayAlertChange: function (evt) {
        let newValue = evt.detail.value;

        this.setData({
            birthDayAlert: newValue
        })
    },
    handleFormSubmit: function (evt) {
        const formData = evt.detail.value;
        //console.log("formData", formData);
        formData.recentPhotoURL = this.data.recentPhotoURL;
        const ao = validateFormData2ao(formData);
        if (ao) {
            //console.log("ao",ao);
            notifyFromPage(ao);
        }
    },
    handleDeleteBtnTap: function (evt) {
        wx.showModal({
            title: "警告",
            content: "确认删除父亲?",
            showCancel: true,
            success: res => {
                if (res.confirm) {
                    notifyFromPage(null);
                    wx.showToast({
                        title: "删除父亲成功!"
                    });
                }
            }
        });
    }
});

let notifyFromPage = function (father) {
    //回调
    if (fromPage && fromPage.onFatherReady) {

        fromPage.onFatherReady(father);
        wx.navigateBack();
    }
};

const validateFormData2ao = function (data) {
    try {
        let name = Assert.stringNotBlank("父亲姓名必须填写", data.name);
        Assert.isTrue("父亲姓名应该两个字或以上", name.length >= 2);

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
            gender: 1,
            mobile,
            recentPhotoURL,
            liveWhere

        };
    } catch (e) {
        App.handleError(e);

    }
    return null;
};

