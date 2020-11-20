"use strict"

// const hostUrl = 'http://106.13.45.179:8080/yolo/wx/'
// const imgHost = "'http://106.13.45.179:8080/yolo/image/"

//内网穿透url
const hostUrl = 'http://liaoxian.natapp1.cc/yolo/wx/'
const imgHost = "'http://liaoxian.natapp1.cc/yolo/wx/image/"

// const hostUrl = "http://192.168.8.133:8080/yolo/wx/"
// const imgHost = 'http://192.168.8.133:8080/yolo/image/'


function request(params) {
    let url = hostUrl + params.url,
        data = params.data,
        loading = params.loading ? params.loading : false,
        method = params.method ? params.method : "GET",
        header = params.header ? params.header : { "content-type": "application/json" }
    checkParams(data)
    return new Promise((resolve, reject) => {
        if (loading) {
            wx.showLoading()
        }
        wx.request({
            url,
            header,
            method,
            data,
            success: (res) => {
                if (loading) {
                    wx.hideLoading()
                }
                resolve(res.data)
            },
            fail: (res) => {
                if (loading) {
                    wx.hideLoading()
                }
                throw new Error("请求失败")
            },
        })
    })
}
function checkParams(data) {
    if (typeof data == "object") {
        for (let i in data) {
            if (typeof data[i] != "number") {
                if (!data[i]) throw new Error("参数" + i + "有误")
            }
        }
    } else {
        throw new Error("请求 data 有误")
    }
}

module.exports = {
    request,
    hostUrl,
    imgHost,
}
