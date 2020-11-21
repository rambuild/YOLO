// pages/comment/comment.js
import { imgHost } from "../../utils/http"
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		user: {},
		commentsList: [],
		imgHost: null
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		let user = wx.getStorageSync("user")
		this.setData({
			user,
			imgHost
		})
		this.getEvaluation()
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {},
	getEvaluation() {
		wx.http({
			url: "getMyEvaluation",
			loading: true,
			data: {
				userId: this.data.user.id
			}
		}).then(res => {
			if (res.code == 200) {
				this.setData({
					commentsList: res.data
				})
			} else {
				wx.showToast({
					title: "请求失败",
					icon: "none"
				})
			}
		})
	}
})
