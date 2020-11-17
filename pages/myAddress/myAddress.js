// pages/myAddress/myAddress.js
const App = getApp()
const http = require("../../utils/http.js")

Page({
    /**
     * 页面的初始数据
     */
    data: {
        userAddress: [], //用户的地址信息
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onShow(options) {
        let userId = wx.getStorageSync("user").id
        wx.http({
            url: "getAddress",
            data: {
                userId,
            },
        }).then((res) => {
            this.setData({
                userAddress: res.data,
            })
        })
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
        // console.log(e)
        wx.http({
            url: "setAddress",
            data: {
                id: e.detail.value,
                userId: App.globalData.user.id,
                type: 2,
            },
        }).then((res) => {
            if (res.code == 200) {
                wx.showToast({
                    title: "设置成功",
                })
            } else {
                wx.showToast({
                    title: "设置失败",
                    icon:"none"
                })
            }
        })
    },
    // 删除地址信息
    remove(option) {
        console.log(option)
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
                        console.log(res)
                        wx.http({
                            url: "getAddress",
                            data: {
                                userId: App.globalData.user.id,
                            },
                        }).then((res) => {
                            console.log(res)
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