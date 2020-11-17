// pages/order/order.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        navList: ["全部", "待付款", "待发货", "待收货", "待评价", "退款"],
        currentIndex: 0,
        userId: null,
        allOrders: [],
        toBePaidList: [], //待付款
        toBeDeliveredList: [], //待发货
        toBeReceivedList: [], // 待收货
        toBeEvaluatedList: [], // 待评价
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({ currentIndex: options.mark })
        //获取内容区域的高度
        this.getContentHeight()

        let userId = wx.getStorageSync("user").id
        this.setData({
            userId,
        })
        // 获取全部订单
        this.getOrders()
    },
    navGo(e) {
        let index = e.currentTarget.dataset.index
        this.setData({
            currentIndex: index,
        })
    },
    getOrders() {
        wx.http({
            url: "getOrder",
            data: {
                userId: this.data.userId,
            },
        }).then((res) => {
            if (res.code == 200) {
                let allOrders = res.data
                let toBePaidList = []
                let toBeDeliveredList = []
                let toBeReceivedList = []
                let toBeEvaluatedList = []
                // 分类各种状态的订单
                res.data.forEach((i) => {
                    if (i.status == 1) {
                        toBePaidList.push(i)
                    } else if (i.status == 2) {
                        toBeDeliveredList.push(i)
                    } else if (i.status == 3) {
                        toBeReceivedList.push(i)
                    } else if (i.status == 6) {
                        toBeEvaluatedList.push(i)
                    }
                })

                // 数组倒置
                allOrders = allOrders.reverse()
                toBePaidList = toBePaidList.reverse()
                toBeDeliveredList = toBeDeliveredList.reverse()
                toBeReceivedList = toBeReceivedList.reverse()
                toBeEvaluatedList = toBeEvaluatedList.reverse()
                this.setData({
                    allOrders,
                    toBePaidList,
                    toBeDeliveredList,
                    toBeReceivedList,
                    toBeEvaluatedList,
                })
            } else {
                wx.showToast({
                    title: "获取订单信息失败",
                    icon: "none",
                })
            }
        })
    },
    //内容区域的高度
    getContentHeight() {
        let clientHeight = 0
        //获取手机的高度
        wx.getSystemInfo({
            success: (res) => {
                clientHeight = res.windowHeight
            },
        })
        //手机高度-导航栏高度==内容区域的高度
        var obj = wx.createSelectorQuery()
        obj.selectAll("#navigation").boundingClientRect()
        obj.exec((res) => {
            let height = res[0][0].height
            this.setData({
                orderHeight: clientHeight - height,
            })
        })
    },
    //滚动
    switchTab(e) {
        this.setData({
            currentIndex: e.detail.current,
        })
    },
})
