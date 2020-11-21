// pages/myPhotoGo/myPhotoGo.js

import { imgHost } from '../../utils/http'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: null,
    productionList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let userId = wx.getStorageSync('user').id
    this.setData({
      userId
    })
    this.getProduction()
  },
  getProduction() {
    wx.http({
      url: 'getProduction',
      loading: true,
      data: {
        userId: this.data.userId
      }
    }).then(res => {
      if (res.code == 200) {
        let productionList = res.data
        productionList.forEach(i => {
          i.img1 = imgHost + i.img1
          i.img2 = imgHost + i.img2
          i.updateTime = i.updateTime.slice(0, 10)
        })
        this.setData({
          productionList
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
})