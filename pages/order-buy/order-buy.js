Page({
    data: {
        userId: null,
        orderList: [],
        userDefaultAddr: {},
        totalPrice: 0,
    },
    onLoad(options) {
        let orderList = JSON.parse(decodeURIComponent(options.orderList))
        // 计算总价
        let totalPrice = 0
        orderList.forEach((i) => {
            totalPrice += parseFloat(i.price) * parseFloat(i.num)
        })
        let userId = wx.getStorageSync("user").id
        this.setData({
            userId,
            orderList,
            totalPrice,
        })
    },
    onShow() {
        this.getUserAddr()
    },
    getUserAddr() {
        wx.http({
            url: "getAddress",
            data: {
                userId: this.data.userId,
            },
        }).then((res) => {
            let userDefaultAddr = {}
            res.data.forEach((i) => {
                if (i.type == 2) {
                    userDefaultAddr = i
                }
            })
            this.setData({
                userDefaultAddr,
            })
        })
    },
    confirmPay() {
        wx.showModal({
            title: '提示',
            content: '确认支付？',
            success: function (res) {
                if (res.confirm) {
                    wx.http({
                        url: "insertOrder",
                        data: {
                            userId: this.data.userId,
                            addressId: this.data.userDefaultAddr.id,
                            price: this.data.totalPrice,
                        },
                    }).then(res => {
                        console.log(res)
                    })
                } else if (res.cancel) {

                }
            }
        });
    },
    selAddr() {
        wx.navigateTo({
            url: '/pages/myAddress/myAddress?action=changeAddr'
        });
    }
})
