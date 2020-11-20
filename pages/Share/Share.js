// pages/Share/Share.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let userId= wx.getStorageSync('user').id
    this.setData({
      userId
    })
    this.getMyCode()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  getMyCode(){
    wx.http({
      url:'getMyCode',
      data:{
        userId:this.data.userId
      }
    }).then(res=>{})
  }
})