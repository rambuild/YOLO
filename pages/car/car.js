"use strict"
//Page Object
Page({
	data: {
		goodsList: [],
		chooseAll: false, //全选
		total: 0 //合计
	},
	onShow() {
		let userId = wx.getStorageSync("user").id
		this.getCartItem(userId, () => {
			this.calcTotal()
		})
	},
	getCartItem(id, callback) {
		wx.showLoading()
		wx.http({
			url: "getShoppingList",
			data: {
				userId: id
			}
		})
			.then(res => {
				wx.hideLoading()
				this.setData({
					goodsList: res.data
				})
				callback()
			})
			.catch(e => {
				wx.hideLoading()
			})
	},
	//单选
	selected(e) {
		let tickIndex = e.currentTarget.dataset.tickindex
		let goodsItem = this.data.goodsList[tickIndex]
		let total = this.data.total
		goodsItem.selected == 0 ? (goodsItem.selected = 1) : (goodsItem.selected = 0)
		if (goodsItem.selected) {
			total += goodsItem.price * goodsItem.num
		} else {
			total -= goodsItem.price * goodsItem.num
		}
		this.setData({ goodsList: this.data.goodsList, total })

		let bool = this.data.goodsList.every(item => {
			return item.selected == 1
		})
		bool ? this.setData({ chooseAll: true }) : this.setData({ chooseAll: false })
		let userId = wx.getStorageSync("user").id
		// 更新商品选中状态
		wx.http({
			url: "updateShoppingList",
			data: {
				id: goodsItem.id,
				selected: goodsItem.selected
			}
		}).then(res => {})
	},
	//全选
	checkAll() {
		let goodsList = this.data.goodsList
		if (this.data.chooseAll) {
			goodsList.forEach(item => {
				item.selected = 0
			})
			this.setData({ chooseAll: false })
		} else {
			goodsList.forEach(item => {
				item.selected = 1
			})
			this.setData({ chooseAll: true })
		}
		this.setData({ goodsList })
		this.calcTotal()
	},
	// 计算合计费用
	calcTotal() {
		let goodsList = this.data.goodsList
		let total = 0
		goodsList.forEach(i => {
			if (i.selected) {
				total += i.price * i.num
			}
		})
		let bool = this.data.goodsList.every(item => {
			return item.selected == 1
		})
		bool ? this.setData({ chooseAll: true }) : this.setData({ chooseAll: false })
		this.setData({
			total
		})
	},
	//加
	addGoodsItem(e) {
		let goodsIndex = e.currentTarget.dataset.goodsindex
		let goodsItem = this.data.goodsList[goodsIndex]
		goodsItem.num++
		this.setData({
			goodsList: this.data.goodsList
		})
		this.calcTotal()
		// 更新商品数量
		wx.http({
			url: "updateShoppingList",
			data: {
				id: goodsItem.id,
				num: goodsItem.num
			}
		}).then(res => {})
	},
	//减
	minusGoodsItem(e) {
		let goodsIndex = e.currentTarget.dataset.goodsindex
		let goodsItem = this.data.goodsList[goodsIndex]
		if (goodsItem.num > 0) {
			goodsItem.num--
			goodsItem.num == 0 ? (goodsItem.selected = 0) : null
		} else {
			goodsItem.num = 0
		}
		//goodsItem.count>0? goodsItem.count-- : 0
		this.setData({ goodsList: this.data.goodsList })
		this.calcTotal()
		// 更新商品数量
		wx.http({
			url: "updateShoppingList",
			data: {
				id: goodsItem.id,
				num: goodsItem.num
			}
		}).then(res => {})
	},
	// 结算
	settlement() {
		let settleOrder = []
		this.data.goodsList.forEach(i => {
			if (i.selected == 1) {
				settleOrder.push(i)
			}
		})
		if (settleOrder.length == 0) {
			wx.showToast({
				title: "未选择商品",
				icon: "none"
			})
		} else {
			wx.navigateTo({
				url: `/pages/order-buy/order-buy?orderList=${encodeURIComponent(JSON.stringify(settleOrder))}`
			})
		}
	}
})
