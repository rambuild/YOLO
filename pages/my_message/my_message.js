// pages/my_message/my_message.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		active: 1,
		userId: null,
		infoList: []
	},
	logistics(option) {
		console.log(option)
		this.setData({
			active: option.currentTarget.dataset.show
		})
	},
	onLoad() {
		let userId = wx.getStorageSync("user").id
		this.setData({
			userId
    })
    this.getInfo()
	},
	getInfo() {
		wx.http({
			url: "getInfo",
			data: {
				userId: this.data.userId
			}
		}).then(res => {
			if (res.code == 200) {
				this.setData({
					infoList: res.data
				})
			}
		})
	}
})
