const app = getApp();
let fromPage = null;
const Assert = App.Assert;
const service = new App.ClansmanService();
Page({

    data: {
        genderArray: "女,男".split(","),
        motherId: 0,
        gender: 0,
        name: '',
        mobile: "",
        birthday: Date.formatDate(new Date()),
        liveWhere: "",
        recentPhotoURL: null
    },
    onLoad: function (options) {
        let motherId = options.motherId;
        //如果传递了母亲id，则查找数据
        if (motherId) {
            service.load(motherId).then(m => {
                this.setData({
                    fatherArray: m.mates,
                    motherName: m.name,
                    motherId: m.id
                });
            });
        } else {
            //尝试从前一个页面获取数据
            let pages = getCurrentPages();
            fromPage = pages[pages.length - 2];
            if (fromPage) {
                let mother = fromPage.data.myself;
                let mates = fromPage.data.mates || [];
                mates = mates.map(m => m.name);

                if (mother) {
                    this.setData({
                        fatherArray: mates,
                        motherName: mother.name,
                        motherId: mother.id
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
    handleFatherChange: function (evt) {
        let newValue = evt.detail.value;
        this.setData({
            "fatherId": newValue
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
        formData.motherId = this.data.motherId;
        const ao = validateFormData2ao(formData);
        if (ao) {
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
        let fatherId = data.fatherId;
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