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
        action: "",
        phoneValid: true
    },
    onLoad(options) {
        let action = options.action
        if (action == 'edit') { // 编辑操作
            let getOptions = JSON.parse(options.info)
            // 设置传过来的省市区
            let addrMain = getOptions.addrMain.substring(1, getOptions.addrMain.length - 1).replace(/"/g, "").split(',')
            this.setData({
                options: getOptions,
                phone: getOptions.phone,
                nick: getOptions.nick,
                action: 'edit',
                region: addrMain,
                address: getOptions.addrDetail
            })
        } else {
            this.setData({
                action: 'add'
            })
        }
        let userId = wx.getStorageSync("user").id
        this.setData({
            userId,
        })
    },
    //省市区三级联动
    bindRegionChange: function (e) {
        this.setData({
            region: e.detail.value,
        })
    },
    // 保存按钮
    formSubmit(e) {
        let { phone, name, address, picker } = e.detail.value
        console.log(e)
        let fullAddress = ""
        for (let i = 0; i < picker.length; i++) {
            fullAddress += picker[i]
        }
        let addrMain = picker
        let addrDetail = address
        fullAddress += address
        console.log(name)
        if (!/^1[0-9]{10}$/.test(phone)) {
            wx.showToast({
                title: "手机号码格式错误",
                icon: "none"
            })
            return
        }
        if (name == "" || address == "" || picker.length == 0) {
            wx.showToast({
                title: "请完善你的收货信息",
                icon: "none"
            })
            return
        }
        if (this.data.action == "add") {
            // 添加地址
            wx.http({
                url: "insertAddress",
                data: {
                    address: fullAddress,
                    phone,
                    nick: name,
                    userId: this.data.userId,
                    type: this.data.type,
                    addrMain,
                    addrDetail
                },
            }).then((res) => {
                if (res.code == 200) {
                    wx.showToast({
                        title: "添加地址成功"
                    })
                    setTimeout(() => {
                        wx.navigateBack({
                            delta: 1
                        })
                    }, 1500)
                }
            })
        } else if (this.data.action == "edit") {
            // 编辑地址
            wx.http({
                url: "updateAddress",
                data: {
                    address: fullAddress,
                    phone,
                    nick: name,
                    userId: this.data.userId,
                    type: this.data.type,
                    id: this.data.options.id,
                    addrMain,
                    addrDetail
                }
            }).then((res) => {
                if (res.code == 200) {
                    wx.showToast({
                        title: "更改地址成功"
                    })
                    setTimeout(() => {
                        wx.navigateBack({
                            delta: 1
                        })
                    }, 1500)
                }
            })
        }
    },
    btn(e) {
        this.setData({
            type: e.target.dataset.type,
        })
    },
    phone(e) {
        if (!/^1[0-9]{10}$/.test(e.detail.value)) {
            wx.showToast({
                title: "手机号码格式错误",
                icon: "none",
            })
            this.setData({
                phone: e.detail.value
            })
            return
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
})
