const app = getApp();
const service = new App.ClansmanService();

Page({
    data: {
        enableDelete: false, //不允许删除父节点
        myself: null,
        father: null,
        mother: null,
        mates: [],
        children: []
    },
    onLoad: function (options) {
        let manId = this.data.id = options.id;
        // manId = '6cd397ca5cf26cca09c703970fa531a8'
        console.log(manId)
        service.load(manId).then(cm => {
            console.log(cm);
            this.setData({
                myself: cm
            });
            cm.loadFather().then(father => {
                this.setData({
                    father
                });
            });
            cm.loadMother().then(mother => {
                this.setData({
                    mother
                });
            });
            cm.loadMates().then(mates => {
                this.setData({
                    mates
                });
            });
            cm.loadChildren().then(children => {
                let enableDelete = children == null || children.length === 0;
                this.setData({
                    children,
                    enableDelete
                });
            });
        });


    },
    //添加配偶
    handleAddMateBtnTap: function (evt) {
        wx.navigateTo({
            url: '/pages/clansman/add-mate/add-mate'
        });
    },
    //添加子女
    handleAddChildBtnTap: function (evt) {
        if (this.data.myself.gender === 1) {
            wx.navigateTo({
                url: '/pages/clansman/add-child/father-add-child?fatherId=' + this.data.myself.id + '&father_id=' + this.data.myself._id
            });
        } else {
            wx.navigateTo({
                url: '/pages/clansman/add-child/mother-add-child?motherId=' + +this.data.myself.id + '&mother_id=' + this.data.myself._id
            });
        }

    },
    //修改族人信息
    handleModifyBtnTap: function (evt) {
        wx.navigateTo({
            url: '/pages/clansman/mod/mod-main-detail'
        });
    },
    //删除族人
    handleDeleteBtnTap: function (evt) {
        service.deleteClansman(this.data.id).then(res => {
            wx.showToast({
                title: '删除成功',
                success: function () {
                    wx.switchTab({
                        url: '/pages/index/index'
                    })
                }
            });
        })
    },
    //母亲回调
    onMotherReady: function (mother) {
        wx.showLoading({
            title: '处理中...'
        });
        service.addMother(this.data.id, mother).then(res => {
            console.log("res", res);
            this.setData({
                mother: mother
            });
            wx.hideLoading();
            wx.showToast({
                title: '添加母亲成功'
            });
        });
    },
    //父亲回调
    onFatherReady: function (father) {
        wx.showLoading({
            title: '处理中...'
        });
        service.addFather(this.data.id, father).then(res => {
            console.log("res", res);
            this.setData({
                father: father
            });
            wx.hideLoading();
            wx.showToast({
                title: '添加父亲成功'
            });
        });

    },
    //添加配偶回调
    onMateAddReady: function (mate) {

        service.addMate(this.data.id, mate).then(mate => {
            let mates = this.data.mates;

            mates.push(mate);
            this.setData({
                mates
            });
            wx.showToast({
                title: '添加配偶成功'
            })
        });
    },
    //子女回调
    onChildReady: function (child) {
        wx.showLoading({
            title: '操作中...'
        });
        service.addChild(this.data.id, child).then(child => {
            console.log("child", child);
            let children = this.data.children;
            children.push(child);
            this.setData({
                children
            });
            wx.showToast({
                title: '添加子女成功'
            })
        });
    }
});