App.ClansmanService = require("/service/ClansmanService");
App.Assert = require("/service/common/Assert");
App.ClansmanEntity = require("/service/repository/ClansmanEntity");
//加载工具方法
require("/service/common/common");

let userInfo = null;

App({
    onLaunch: function () {

        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                env: "zhanghao-8144bd",
                traceUser: true,
            })
        }

        this.globalData = {}
    },
    getUserInfo: function () {
        return new Promise(function (ok, fail) {
            if (userInfo !== null) {
                ok(userInfo);
            } else {
                // 获取用户信息
                wx.getSetting({
                    success: res => {
                        if (!res.authSetting['scope.userInfo']) {
                            //跳到授权界面
                            wx.redirectTo({
                                url: '/pages/authorize/authorize',
                            });

                        } else {
                            wx.getUserInfo({
                                success(res) {
                                    userInfo = res.userInfo;
                                    ok(res.userInfo);
                                }
                            });
                        }
                    } //end getSetting success
                });
            } //end else
        }); //end promise
    },
    matesOrderArray: function () {
        const arr = ["现任"];
        for (let i = 0; i++ < 10; arr.push("第" + i + "任")) ;
        return arr;
    }
})
App.handleError = function (e) {
    console.log(e);
    if (e.appError) {
        wx.showModal({
            title: "错误",
            content: e.message,
            showCancel: false
        });
    } else {
        wx.showModal({
            title: "提示",
            content: '系统繁忙，请稍后再试。',
            showCancel: false
        });
    }
};