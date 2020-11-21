// pages/goodsEvaluate/goodsEvaluate.js
import { imgHost } from "../../utils/http"
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		score1: null,
		score2: null,
		score3: null,
		score4: null,
		evaluation: "",
		evaluateItem: {},
		imgHost:null
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		let item = JSON.parse(decodeURIComponent(options.item))
		this.setData({
			evaluateItem: item,
			imgHost
		})
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () { },

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () { },
	changeRate(e) {
		let { rateObj, value } = e.detail
		switch (rateObj) {
			case "all":
				this.setData({ score1: value })
				break
			case "attitude":
				this.setData({ score2: value })
				break
			case "quality":
				this.setData({ score3: value })
				break
			case "timeliness":
				this.setData({ score4: value })
				break
		}
	},
	// 捕获textarea失焦事件，记录其值
	handleEvaBlur(e) {
		let val = e.detail.value
		this.setData({
			evaluation: val
		})
	},
	subComments() {
		let { score1, score2, score3, score4, evaluation } = this.data
		if (score1 && score2 && score3 && score4 && evaluation) {
			wx.http({
				url: "updateOrderInfo",
				loading:true,
				data: {
					score1,
					score2,
					score3,
					score4,
					evaluation,
					id: this.data.evaluateItem.id
				}
			}).then(res => {
				if (res.code == 200) {
					wx.showToast({
						title: "评价成功"
					})
					setTimeout(() => {
						wx.navigateBack({
							 delta: 1
						})
					}, 1500)
				} else {
					wx.showToast({
						title: res.msg,
						icon: "none"
					})
				}
			})
		} else {
			wx.showToast({
				title: "请评价所有的项",
				icon: "none"
			})
		}
	}
})
