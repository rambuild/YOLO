"use strict"
//Page Object
import { imgHost } from "../../utils/http"
// 自定义计算方法，处理JS计算小数的精度问题
import calc from "../../utils/calc"
Page({
	data: {
		goodsList: [],
		chooseAll: false, //全选
		total: 0, //合计
		editFlag: false,
		userId: null,
		imgHost: null
	},
	onShow() {
		let userId = wx.getStorageSync("user").id
		this.setData({
			imgHost
		})
		this.setData({
			userId
		})
		this.getCartItem(() => {
			this.calcTotal()
		})
	},
	getCartItem(callback) {
		wx.http({
			url: "getShoppingList",
			loading: true,
			data: {
				userId: this.data.userId
			}
		}).then(res => {
			this.setData({
				goodsList: res.data
			})
			callback()
		})
	},
	//单选
	selected(e) {
		let tickIndex = e.currentTarget.dataset.tickindex
		let goodsList = JSON.parse(JSON.stringify(this.data.goodsList))
		let id = null
		let selected = null

		goodsList.forEach((i, index) => {
			if (tickIndex == index) {
				i.selected == 0 ? (i.selected = 1) : (i.selected = 0)
				id = i.id
				selected = i.selected
			}
		})
		this.setData({ goodsList })
		// 计算总价
		this.calcTotal()
		// 更新商品选中状态
		wx.http({
			url: "updateShoppingList",
			data: {
				id,
				selected
			}
		}).then(res => {})
	},
	//全选
	checkAll() {
		let goodsList = this.data.goodsList
		if (this.data.chooseAll) {
			goodsList.forEach(item => {
				item.selected = 0
				// 更新商品选中状态
				wx.http({
					url: "updateShoppingList",
					data: {
						id: item.id,
						selected: item.selected
					}
				})
			})
			this.setData({ chooseAll: false })
		} else {
			goodsList.forEach(item => {
				item.selected = 1
				// 更新商品选中状态
				wx.http({
					url: "updateShoppingList",
					data: {
						id: item.id,
						selected: item.selected
					}
				})
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
				// total += parseFloat(i.price) * parseFloat(i.num)
				total = calc.add(total, calc.mul(i.price, i.num))
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
	// 结算或删除所选订单
	settle() {
		let { editFlag } = this.data
		// 先判断是否选择了订单
		let settleOrder = []
		this.data.goodsList.forEach(i => {
			if (i.selected == 1) {
				settleOrder.push(i)
			}
		})
		if (settleOrder.length == 0) {
			wx.showToast({
				title: "未选择订单",
				icon: "none"
			})
			return
		}
		// 删除所选订单
		if (editFlag) {
			wx.showModal({
				title: "提示",
				content: "确定删除所选订单？",
				success: res => {
					if (res.confirm) {
						wx.http({
							url: "delShoppingList",
							data: {
								userId: this.data.userId
							}
						}).then(res => {
							if (res.code == 200) {
								this.getCartItem()
								wx.showToast({
									title: "删除成功"
								})
							}
						})
					}
				}
			})
		}
		//结算
		else {
			wx.navigateTo({
				url: `/pages/order-buy/order-buy?orderList=${encodeURIComponent(JSON.stringify(settleOrder))}`
			})
		}
	},
	// 编辑/取消编辑
	edit() {
		let { editFlag } = this.data
		editFlag = !editFlag
		this.setData({
			editFlag
		})
	}
})
