const http = require("./utils/http")
wx.http = http.request
App({
    onLaunch(options) {
        // 播放音乐
        // const innerAudioContext = wx.createInnerAudioContext() //新建一个createInnerAudioContext();
        // innerAudioContext.autoplay = true //音频自动播放设置
        // innerAudioContext.src = "http://dy.quwei360.com.cn/zh/image/a.mp3" //链接到音频的地址
        // innerAudioContext.onPlay(() => {
        //     console.log('播放成功')
        // }) //播放音效
        // innerAudioContext.onError((res) => {
        //     //打印错误
        //     console.log(res) //错误信息
        //     // console.log(res.errCode) //错误码
        // })

        // 登录
        // wx.showLoading({mask: true});
        let parentId = 0
        let userId = options.query.userId
        if (userId) {
            parentId = userId
        }
        wx.login({
            success: (res) => {
                console.log('login', res)
                let proLogin = this.login(res.code, parentId)
                let userInfo = this.getUserInfo()
                Promise.all([proLogin, userInfo]).then((res) => {
                    let [{ data: user }, info] = res
                    // console.log(user)

                    if (Object.keys(info).length > 0) {
                        user.wxNick = info.nickName
                        user.wxUrl = info.avatarUrl
                        wx.http({
                            url: "/updateUser",
                            data: {
                                openId: user.openId,
                                id: user.id,
                                wxNick: info.nickName,
                                wxUrl: info.avatarUrl,
                            },
                        })
                    }
                    this.globalData.user = user
                    wx.setStorageSync('user', user)
                    if (this.callback) {
                        this.callback(user)
                    }
                    // wx.hideLoading();
                })
            },
        })
    },
    // 获取用户信息
    login(code, parentId) {
        return wx
            .http({
                url: "getOpenid",
                data: {
                    json: code,
                },
            })
            .then((res) => {
                return wx.http({
                    url: "getUser",
                    data: {
                        openId: res.data.openid,
                        parentId
                    },
                })
            })
    },
    getUserInfo() {
        return new Promise((resolve, reject) => {
            wx.getSetting({
                success: (res) => {
                    if (res.authSetting["scope.userInfo"]) {
                        wx.getUserInfo({
                            success: (res) => {
                                resolve(res.userInfo)
                            },
                            fail: (err) => {
                                reject(err)
                            },
                        })
                    } else {
                        resolve(new Object())
                    }
                },
            })
        })
    },
    globalData: {
        user: null, //用户信息
    },
})
