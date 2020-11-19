// pages/user/user.js
const app = getApp()

Page({
    data: {},
    onLoad: function (options) {
        if (app.globalData.user) {
            this.setData({
                user: app.globalData.user,
            })
        } else {
            app.callback = (user) => {
                this.setData({
                    user,
                })
            }
        }
    },
    getUserInfo(e) {
        let userInfo = e.detail.userInfo
        let user = this.data.user
        user.wxUrl = userInfo.avatarUrl
        user.wxNick = userInfo.nickName
        this.setData({
            user,
        })
    },
    //订单页
    orderGo(e) {
        let mark = e.currentTarget.dataset.mark || 0
        wx.navigateTo({
            url: "/pages/order/order?mark=" + mark,
        })
    },
    //地址页
    addressGo(e) {
        wx.navigateTo({
            url: "/pages/myAddress/myAddress",
        })
    },
    // 优惠券页
    goToRedPacket() {
        wx.navigateTo({
            url: "/pages/redpacket/redpacket",
        })
    },
    myMessageGo() {
        wx.navigateTo({
            url: "/pages/my_message/my_message",
        })
    },
    myPhotoGo() {
        wx.navigateTo({
            url: "/pages/myPhotoGo/myPhotoGo",
        })
    },
    helpGo() {
        wx.navigateTo({
            url: "/pages/help/help",
        })
    },
    invitationGO() {
        wx.navigateTo({
            url: "/pages/Invitation/Invitation",
        })
    },
    commentGo() {
        wx.navigateTo({
            url: "/pages/comment/comment",
        })
    },
})
