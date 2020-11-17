// pages/address/address.js
let App = getApp()

const http = require("../../utils/http.js")
Page({
    data: {
        region: [],
        address: "", //地址
        phone: "", //手机号
        nick: "", //收货人
        type: "", //是否设置为默认地址
        userId: "", //用户id
        id: "", //地址id
        options: {},
        action:""
    },
    onLoad(options) {
        let action = options.action
        if (action == 'edit') { // 编辑操作
            let getOptions = JSON.parse(options.info)
            this.setData({
                options: getOptions,
                phone: getOptions.phone,
                nick: getOptions.nick,
                action:'edit'
            })
        }else{
            this.setData({
                action:'add'
            })
        }
        let userId = wx.getStorageSync("user").id
        this.setData({
            userId,
        })
    },
    //省市区三级联动
    bindRegionChange: function (e) {
        console.log("picker发送选择改变，携带值为", e.detail.value)
        this.setData({
            region: e.detail.value,
        })
    },
    // 保存按钮
    formSubmit(e) {
        let address = ""
        console.log("form发生了submit事件，携带数据为：", e)
        for (let i = 0; i < e.detail.value.picker.length; i++) {
            address += e.detail.value.picker[i]
        }
        address += e.detail.value.address
        this.setData({
            address: address,
            phone: e.detail.value.phone,
            nick: e.detail.value.men,
        })
        if (this.data.action == "add") {
            // 添加地址
            wx.http({
                url: "insertAddress",
                data: {
                    address: this.data.address,
                    phone: this.data.phone,
                    nick: this.data.nick,
                    userId: this.data.userId,
                    type: this.data.type,
                },
            }).then((res) => {
                wx.navigateTo({
                    url: "/pages/myAddress/myAddress",
                })
                wx.showToast({
                    title: "添加地址成功"
                })
            })
        } else if (this.data.action == "edit") {
            // 编辑地址
            wx.http({
                url: "updateAddress",
                data: {
                    address: this.data.address,
                    phone: this.data.phone,
                    nick: this.data.nick,
                    userId: this.data.userId,
                    type: this.data.type,
                    id: this.data.options.id,
                }
            }).then((res) => {
                wx.navigateTo({
                    url: "/pages/myAddress/myAddress",
                })
                wx.showToast({
                    title: "更改地址成功"
                })
            })
        }
    },
    btn(e) {
        this.setData({
            type: e.target.dataset.type,
        })
    },
    phone(e) {
        console.log(e)
        if (!/^1[3456789]\d{9}$/.test(e.detail.value)) {
            wx.showToast({
                title: "联系人电话格式错误",
                icon: "none",
            })
            return
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
})
