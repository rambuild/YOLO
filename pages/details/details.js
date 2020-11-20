// pages/details/details.js
Page({
	data: {
		tab: 1,
		activeNames: ["1"],
		windowH: wx.getSystemInfoSync().windowHeight,
		isAfterDiy: false,
		proInf: {},
		proSku: [],
		selTapOne: null,
		selTapTwo: null,
		selTapThree: null,
		selTapFour: null,
		goodsComment: [],
		goodsId: null
	},
	onLoad(options) {
		this.data.goodsId = options.id
		// 获取商品信息
		this.getProInf(options.id)
		// 获取商品分类'
		this.getGoodsSku(options.id)
		// 获取商品评价
		this.getGoodsComment(options.id)
	},
	changeTab(e) {
		this.setData({
			tab: e.currentTarget.dataset.tab
		})
	},
	onChange(event) {
		this.setData({
			activeNames: event.detail
		})
	},
	toOrder() {
		wx.showModal({
			title: "提示",
			content: "亲，您还没有定制内容，是否开始定制？",
			cancelText: "直接购买",
			confirmText: "开始定制",
			confirmColor: "#ff0000",
			success: res => {
				if (res.confirm) {
					// 开始定制
					console.log("用户点击直接购买")
				} else if (res.cancel) {
					// 直接购买
					// 选择所有分类才跳转
					if (
						this.data.selTapOne != null &&
						this.data.selTapTwo != null &&
						this.data.selTapThree != null &&
						this.data.selTapFour != null
					) {
						let img1 = this.data.proSku[this.data.selTapOne].goodsSkuList[this.data.selTapTwo].goodsSkuList[
							this.data.selTapThree
						].img1
						let img2 = this.data.proSku[this.data.selTapOne].goodsSkuList[this.data.selTapTwo].goodsSkuList[
							this.data.selTapThree
						].img2
						let img3 = this.data.proSku[this.data.selTapOne].goodsSkuList[this.data.selTapTwo].goodsSkuList[
							this.data.selTapThree
						].img3
						let img4 = this.data.proSku[this.data.selTapOne].goodsSkuList[this.data.selTapTwo].goodsSkuList[
							this.data.selTapThree
						].img4

						let color = this.data.proSku[this.data.selTapOne].skuName
						let category = this.data.proSku[this.data.selTapOne].goodsSkuList[this.data.selTapTwo].skuName
						let model = this.data.proSku[this.data.selTapOne].goodsSkuList[this.data.selTapTwo]
							.goodsSkuList[this.data.selTapThree].skuName

						let size = this.data.proSku[this.data.selTapOne].goodsSkuList[this.data.selTapTwo].goodsSkuList[
							this.data.selTapThree
						].sizeList[this.data.selTapFour]
						const app = getApp()
						let userId = app.globalData.user.id
						let reqParams = {
							img1,
							img2,
							img3,
							img4,
							size,
							color,
							category,
							model,
							userId,
							goodsId: this.data.proInf.id,
							goodsName: this.data.proInf.goodsName,
							price: this.data.proInf.price
						}
						wx.http({
							url: "insertShoppingList",
							data: reqParams
						}).then(res => {
							console.log(res)
						})
						wx.switchTab({
							url: `../car/car`
						})
					} else {
						wx.showToast({
							title: "请选择所有分类",
							icon: "none"
						})
					}
				}
			}
		})
	},
	navClothes() {
		// 选择所有分类才跳转
		if (
			this.data.selTapOne != null &&
			this.data.selTapTwo != null &&
			this.data.selTapThree != null &&
			this.data.selTapFour != null
		) {
			let imgs = {}
			imgs.img1 = this.data.proSku[this.data.selTapOne].goodsSkuList[this.data.selTapTwo].goodsSkuList[
				this.data.selTapThree
			].img1
			imgs.img2 = this.data.proSku[this.data.selTapOne].goodsSkuList[this.data.selTapTwo].goodsSkuList[
				this.data.selTapThree
			].img2
			imgs.img3 = this.data.proSku[this.data.selTapOne].goodsSkuList[this.data.selTapTwo].goodsSkuList[
				this.data.selTapThree
			].img3
			imgs.img4 = this.data.proSku[this.data.selTapOne].goodsSkuList[this.data.selTapTwo].goodsSkuList[
				this.data.selTapThree
			].img4
			let size = this.data.proSku[this.data.selTapOne].goodsSkuList[this.data.selTapTwo].goodsSkuList[
				this.data.selTapThree
			].sizeList[this.data.selTapFour]
			wx.navigateTo({
				url: `../clothes/clothes?imgs=${encodeURIComponent(JSON.stringify(imgs))}&size=${size}&goodsId=${
					this.data.goodsId
				}`
			})
		} else {
			wx.showToast({
				title: "请选择所有分类",
				icon: "none"
			})
		}
	},
	selOneTap(e) {
		let index = e.currentTarget.dataset.item
		this.setData({
			selTapOne: index
		})
	},
	selTwoTap(e) {
		let index = e.currentTarget.dataset.item
		this.setData({
			selTapTwo: index
		})
	},
	selThreeTap(e) {
		let index = e.currentTarget.dataset.item
		try {
			this.setData({
				selTapThree: index
			})
			this.setData({
				"proInf.img": this.data.proSku[this.data.selTapOne].goodsSkuList[this.data.selTapTwo].goodsSkuList[
					this.data.selTapThree
				].img1
			})
		} catch (e) {
			wx.showToast({
				title: "没有商品",
				duration: 1500,
				icon: "none"
			})
		}
	},
	selFourTap(e) {
		let index = e.currentTarget.dataset.item
		this.setData({
			selTapFour: index
		})
	},
	getProInf(id) {
		wx.http({
			url: "getGoodsById",
			data: {
				id
			}
		}).then(res => {
			this.setData({
				proInf: res.data
			})
		})
	},
	getGoodsSku(id) {
		wx.http({
			url: "getGoodsSku",
			data: {
				goodsId: id
			}
		}).then(res => {
			this.setData({
				proSku: res.data
			})
		})
	},
	getGoodsComment(goodsId) {
		wx.http({
			url: "getGoodsComment",
			data: {
				goodsId
			}
		}).then(res => {
			let goodsComment = res.data
			goodsComment.forEach(i => {
				i.score1 = parseInt(i.score1)
                i.phone = i.phone.slice(0, 3) + "*****" + i.phone.slice(8)
                // i.phone = i.phone.slice(0,3).padEnd(11,"*")
			})
			this.setData({
				goodsComment: res.data
			})
		})
	},
	onShareAppMessage: function () {}
})
