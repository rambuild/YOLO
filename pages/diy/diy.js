// pages/diy/diy.js
import { imgHost } from "../../utils/http"
Page({
	data: {
		levelOneTabIndex: 0,
		levelTwoTabIndex: 0,
		levelOne: [],
		levelTwo: [],
		product: [],
		page: 0, //页数
		limit: 10, //每页条数
		imgHost: null
	},
	onLoad() {
        this.getSysInfo()
        this.setData({
            imgHost
        })
	},
	onShow() {
		//一级分类
		;(async () => {
			await this.getCategory()
		})()
	},
	getSysInfo() {
		let systemInfo = wx.getSystemInfoSync()
		let menuButton = wx.getMenuButtonBoundingClientRect()
		this.setData({
			systemInfo,
			menuButton
		})
	},
	navigateDetails(e) {
		let id = this.data.product[e.currentTarget.dataset.item].id
		wx.navigateTo({
			url: "../details/details?id=" + id
		})
	},
	getCategory() {
		wx.http({
			url: "getCategory",
			data: {
				status: 1
			}
		}).then(res => {
			if (res.code == 200 && res.data.length > 0) {
				let levelTwo = new Array(parseInt(res.data.length))
				this.setData({
					levelOne: res.data,
					levelTwo
				})
				this.getCategoryById(this.data.levelOne[this.data.levelOneTabIndex].id, this.data.levelOneTabIndex)
			}
		})
	},
	getCategoryById(categoryId, index) {
		wx.http({
			url: "getCategoryById",
			data: {
				categoryId
			}
		}).then(res => {
			this.data.levelTwo[index] = res.data
			//获取商品
			if (res.data.length > 0) {
				this.getGoodsByCategory(res.data[0].id)
			}
			this.setData({
				levelTwo: this.data.levelTwo
			})
		})
	},
	getGoodsByCategory(id) {
		wx.http({
			loading: true,
			url: "getGoodsByCategory",
			data: {
				id,
				limit: this.data.limit,
				offset: this.data.limit * this.data.page
			}
		}).then(res => {
			let product = res.data
			this.setData({
				product
			})
		})
	},
	clickOnetap(e) {
		let index = e.currentTarget.dataset.tab
		this.getCategoryById(this.data.levelOne[index].id, index)
		this.setData({
			levelOneTabIndex: index
		})
	},
	clickTwotap(e) {
		let index = e.currentTarget.dataset.tab
		let { levelTwo, levelOneTabIndex } = this.data
		this.setData({
			levelTwoTabIndex: index
		})
		this.getGoodsByCategory(levelTwo[levelOneTabIndex][index].id, index)
		this.setData({
			// levelOneTab: index,
		})
	}
})
