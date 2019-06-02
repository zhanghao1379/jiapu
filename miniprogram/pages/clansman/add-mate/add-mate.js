const app = getApp();
const MATE_ORDER_ARRAY = app.matesOrderArray();
let fromPage = null;
const Assert = App.Assert;
Page({

    data: {
        genderArray: "女,男".split(","),
        mateOrderArray: MATE_ORDER_ARRAY,
        mateOrder: 0,
        name: '',
        mobile: "",
        gender: 0,
        birthday: Date.formatDate(new Date()),
        liveWhere: "",
        recentPhotoURL: null
    },
    onLoad: function (options) {
        let pages = getCurrentPages();
        fromPage = pages[pages.length - 2];

        if (fromPage) {
            //根据性别初始化页面
            if (fromPage.data.myself) {
                console.log(fromPage.data.myself)
                let mateGender = fromPage.data.myself.gender;
                this.setData({
                    gender: mateGender === 1 ? 0 : 1
                });
            }
            //根据已有配偶估算第几任
            if (fromPage.data.mates) {
                let mates = fromPage.data.mates;
                this.setData({
                    mateOrder: mates.length
                });

            }
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
    handleMateOrderChange: function (evt) {
        let newValue = evt.detail.value;
        this.setData({
            "mateOrder": newValue
        })
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
        const ao = validateFormData2ao(formData);
        if (ao) {
            notifyFromPage(ao);
        }
    }

});

let notifyFromPage = function (mate) {
    //回调
    if (fromPage && fromPage.onMateAddReady) {

        fromPage.onMateAddReady(mate);
        wx.navigateBack();
    }
};

const validateFormData2ao = function (data) {
    try {
        let name = Assert.stringNotBlank("配偶姓名必须填写", data.name);
        Assert.isTrue("配偶姓名应该两个字或以上", name.length >= 2);
        let mateOrder = data.mateOrder;
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
            mateOrder,
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