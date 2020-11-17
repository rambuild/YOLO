// pages/my_message/my_message.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:1
  },
  logistics(option){
    console.log(option);
    this.setData({
    active:option.currentTarget.dataset.show
    })
  },
  logistics(option){
    console.log(option);
    this.setData({
    active:option.currentTarget.dataset.show
    })
  }

})