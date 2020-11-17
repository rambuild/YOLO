// pages/diy/diy.js
Page({
    data: {
        levelOneTab: 0,
        levelTwoTab: 0,
        levelOne: [],
        levelTwo: [],
        product: [],
        page: 0, //页数
        limit: 10, //每页条数
    },

    onLoad: function (options) {
        this.getsysInfo()
        //一级分类
        ;(async () => {
            await this.getList(1)
            this.getListChild(this.data.levelOne[0].id, 0)
        })()
    },
    getsysInfo() {
        let systemInfo = wx.getSystemInfoSync()
        let menuButton = wx.getMenuButtonBoundingClientRect()
        this.setData({
            systemInfo,
            menuButton,
        })
    },
    navigateDetails(e) {
        let id = this.data.product[e.currentTarget.dataset.item].id
        wx.navigateTo({
            url: "../details/details?id=" + id,
        })
    },
    getList(status) {
        return new Promise((resolve, reject) => {
            wx.http({
                url: "getCategory",
                data: {
                    status,
                },
            })
                .then((res) => {
                    let levelOne = res.data
                    let levelTwo = new Array(parseInt(levelOne.length))
                    this.setData({
                        levelOne,
                        levelTwo,
                    })
                    resolve()
                })
                .catch((res) => {
                    reject()
                })
        })
    },
    getListChild(categoryId, index) {
        if (!this.data.levelTwo[index]) {
            wx.http({
                url: "getCategoryById",
                data: {
                    categoryId,
                },
            }).then((res) => {
                this.data.levelTwo[index] = res.data
                //获取商品
                this.getProduct(res.data[0].id)
                this.setData({
                    levelTwo: this.data.levelTwo,
                })
            })
        }
    },
    getProduct(id) {
        wx.http({
            url: "getGoodsByCategory",
            data: {
                id,
                limit: this.data.limit,
                offset: this.data.limit * this.data.page,
            },
        }).then((res) => {
            let product = res.data
            this.setData({
                product,
            })
        })
    },
    levelOnetap(e) {
        let index = e.currentTarget.dataset.tab
        this.getListChild(this.data.levelOne[index].id, index)
        this.setData({
            levelOneTab: index,
        })
    },
    levelTwotap(e) {
        let index = e.currentTarget.dataset.tab
        console.log(e.currentTarget.dataset)
        // console.log(this.data.levelTwo[0][index].id)
        this.getListChild(this.data.levelTwo[index].id, index)
        this.setData({
            // levelOneTab: index,
        })
    },
})
