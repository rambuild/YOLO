// pages/Share/Share.js
import { imgHost } from "../../utils/http"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: null,
    imgHost: null,
    codeUrl: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let userId = wx.getStorageSync('user').id
    this.setData({
      imgHost,
      userId
    })
    this.getMyCode()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  getMyCode() {
    wx.http({
      url: 'getMyCode',
      loading: true,
      data: {
        userId: this.data.userId,
        url: `pages/index/index?userId=${this.data.userId}`
      }
    }).then(res => {
      if (res.code == 200) {
        this.setData({
          codeUrl: res.data.code
        })
      }
    })
  },
  previewImg() {
    setTimeout(() => {
      wx.showToast({
        title: '长按保存或分享给朋友',
        icon: "none"
      })
    }, 200)
    let codeUrl = this.data.imgHost + this.data.codeUrl
    wx.previewImage({
      current: codeUrl, // 当前显示图片的http链接
      urls: [codeUrl] // 需要预览的图片http链接列表
    })
  }
})