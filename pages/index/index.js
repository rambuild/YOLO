//Page Object
import { imgHost } from "../../utils/http"
Page({
	data: {
		active: 0,
		banner: {},
		limit: 10,
		page: 0,
		indexList: [],
		imgHost: null
	},
	onLoad(options) {
		this.setData({ imgHost })
		//获取banner
		;(async () => {
			await this.getBanner(2)
			this.getIndexList(this.data.banner.origin[0].id)
		})()
	},

	//item(index,pagePath,text)
	onTabItemTap: function (item) {},
	onChange(event) {
		let index = event.detail.index
		this.getIndexList(this.data.banner.origin[index].id)
		this.setData({
			active: index
		})
	},
	getBanner(status) {
		return new Promise((resolve, reject) => {
			wx.http({
				url: "getCategory",
				data: {
					status
				}
			}).then(res => {
				let bannerImg = []
				res.data.forEach(element => {
					bannerImg.push(element.img)
				})
				this.setData({
					banner: {
						bannerImg,
						origin: res.data
					}
				})
				resolve()
			})
		})
	},
	getIndexList(id) {
		wx.http({
			url: "getHomeGoods",
			data: {
				id,
				limit: this.data.limit,
				offset: this.data.limit * this.data.page
			}
		}).then(res => {
			this.setData({
				indexList: res.data
			})
		})
	},
	navProduct(e) {
		let id = this.data.indexList[e.currentTarget.dataset.item].id
		wx.navigateTo({
			url: "../details/details?id=" + id
		})
	},
	// 查看更多跳转到定制页面
	diyGO() {
		wx.switchTab({
			url: "/pages/diy/diy"
		})
	}
})
