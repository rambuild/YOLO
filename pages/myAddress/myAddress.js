// pages/myAddress/myAddress.js

Page({
    /**
     * 页面的初始数据
     */
    data: {
        userAddress: [], //用户的地址信息
        action: null,
        userId: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onShow() {
        let userId = wx.getStorageSync("user").id
        this.setData({
            userId
        })
        wx.http({
            url: "getAddress",
            loading: true,
            data: {
                userId,
            },
        }).then((res) => {
            this.setData({
                userAddress: res.data,
            })
        })

    },
    onLoad(options) {
        if (options.action) {
            this.setData({
                action: options.action
            })
        }
    },
    // 页面跳转
    addressGo(e) {
        let options = e.currentTarget.dataset.item
        let action = e.currentTarget.dataset.action
        if (action == "edit") {
            wx.navigateTo({
                url: `/pages/address/address?info=${JSON.stringify(options)}&action=edit`,
            })
        } else if (action == "add") {
            wx.navigateTo({
                url: `/pages/address/address?action=add`,
            })
        }
    },
    // 设为默认地址
    radioChange(e) {
        wx.http({
            url: "setAddress",
            loading: true,
            data: {
                id: e.detail.value,
                userId: this.data.userId,
                type: 2,
            },
        }).then((res) => {
            if (res.code == 200) {
                if (this.data.action == "changeAddr") {
                    wx.navigateBack({
                        delta: 1
                    })
                } else {
                    wx.showToast({
                        title: "设置成功",
                    })
                }
            } else {
                wx.showToast({
                    title: "设置失败",
                    icon: "none"
                })
            }
        })
    },
    // 点击地址栏修改默认地址
    selAddr(e) {
        let { index, addr } = e.currentTarget.dataset
        wx.http({
            url: "setAddress",
            loading: true,
            data: {
                id: addr.id,
                userId: this.data.userId,
                type: 2,
            },
        }).then((res) => {
            if (res.code == 200) {
                // 如果是从订单提交页过来更改地址的就回退过去
                if (this.data.action == "changeAddr") {
                    wx.navigateBack({
                        delta: 1
                    })
                } else {
                    let userAddress = JSON.parse(JSON.stringify(this.data.userAddress))
                    userAddress.forEach(i => {
                        i.type = 1
                    })
                    userAddress[index].type = 2
                    this.setData({
                        userAddress
                    })
                    wx.showToast({
                        title: "设置成功",
                    })
                }
            } else {
                wx.showToast({
                    title: "设置失败",
                    icon: "none"
                })
            }
        })
    },
    // 删除地址信息
    remove(option) {
        wx.showModal({
            title: "提示",
            content: "确定删除此地址？",
            success: (res) => {
                if (res.confirm) {
                    wx.http({
                        url: "updateAddress",
                        data: {
                            id: option.target.dataset.id.id,
                            isDelete: 2,
                            userId: option.target.dataset.id.userId,
                        },
                    }).then((res) => {
                        wx.http({
                            url: "getAddress",
                            data: {
                                userId: this.data.userId,
                            },
                        }).then((res) => {
                            this.setData({
                                userAddress: res.data,
                            })
                            wx.showToast({
                                title: "删除地址成功",
                            })
                        })
                    })
                } else if (res.cancel) {
                    console.log("用户点击取消")
                }
            },
        })
    },
})
