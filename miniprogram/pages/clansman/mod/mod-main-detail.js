let fromPage = null;
const app = getApp();
const service = new App.ClansmanService();
const Assert = App.Assert;

Page({

    /**
     * Page initial data
     */
    data: {

        genderArray: "男,女".split(","),
        gender: 0,
        birthday: null

    },
    onLoad: function (options) {
        console.log(11)
        let pages = getCurrentPages();

        //获取上一个page
        fromPage = pages[pages.length - 2];
        //更新上一个page的fatherId
        if (fromPage && fromPage.data.myself) {
            console.log(fromPage.data.myself)

            let cm = fromPage.data.myself;
            let _id = cm._id;
            let name = cm.name;
            let gender = cm.gender ? 0 : 1;
            let birthday = cm.birthday;
            let mobile = cm.mobile || null;
            let liveWhere = cm.liveWhere || null;
            let recentPhotoURL = cm.recentPhotoURL || null;
            this.setData({
                _id,
                name,
                gender,
                birthday,
                mobile,
                liveWhere,
                recentPhotoURL
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
                    "recentPhotoURL": tempFilePaths[0]
                });
            }
        });
    },
    handleBirthDayChange: function (evt) {
        let newValue = evt.detail.value;
        this.setData({
            "birthday": newValue

        })
    },
    handleGenderChange: function (evt) {
        let newValue = evt.detail.value;
        this.setData({
            "gender": newValue

        })
    },

    handleFormSubmit: function (evt) {
        const formData = evt.detail.value;
        formData.recentPhotoURL = this.data.recentPhotoURL;
        const ao = validateFormData2ao(formData);
        if (ao) {
            service.modify(this.data._id, ao).then(resp => {
                if (fromPage && fromPage.data.myself) {

                    let newMyself = Object.assign(fromPage.data.myself, ao);
                    fromPage.setData({
                        myself: newMyself
                    });

                }
                wx.showToast({
                    title: "修改成功!"
                });

                setTimeout(function () {
                    wx.navigateBack();
                }, 500);

            }).catch(err => {
                App.handleError(err);
            });
        }
    }
});


const validateFormData2ao = function (data) {
    try {
        let name = Assert.stringNotBlank("姓名必须填写", data.name);
        Assert.isTrue("姓名应该两个字或以上", name.length >= 2);
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
            liveWhere

        };
    } catch (e) {
        App.handleError(e);

    }
    return null;
};