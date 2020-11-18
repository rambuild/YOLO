const App = getApp()
Page({
	data: {
		user: {},
		orderList: [],
		userDefaultAddr: {},
		totalPrice: 0
	},
	onLoad(options) {
		let orderList = JSON.parse(decodeURIComponent(options.orderList))
		// 计算总价
		let totalPrice = 0
		orderList.forEach(i => {
			totalPrice += parseFloat(i.price) * parseFloat(i.num)
		})
		let user = wx.getStorageSync("user")
		this.setData({
			user,
			orderList,
			totalPrice
		})
	},
	onShow() {
		this.getUserAddr()
	},
	getUserAddr() {
		wx.http({
			url: "getAddress",
			loading:true,
			data: {
				userId: App.globalData.user.id,
			}
		})
			.then(res => {
				let userDefaultAddr = {}
				res.data.forEach(i => {
					if (i.type == 2) {
						userDefaultAddr = i
					}
				})
				this.setData({
					userDefaultAddr
				})
			})
	},
	confirmPay() {
		wx.showModal({
			title: "提示",
			content: "确认支付？",
			success: res => {
				if (res.confirm) {
					wx.http({
						url: "insertOrder",
						data: {
							userId: this.data.user.id,
							addressId: this.data.userDefaultAddr.id,
							price: this.data.totalPrice
						}
					}).then(res => {
						if (res.code == 200) {
							wx.http({
								url: "prepay",
								data: {
									qorderid: res.data.orderId,
									qgmopenid: this.data.user.openId,
									qsum: this.data.totalPrice
								}
							}).then(res => {})
						} else {
							wx.showToast({
								title: res.msg,
								icon: "none"
							})
						}
					})
				} else if (res.cancel) {
				}
			}
		})
	},
	selAddr() {
		wx.navigateTo({
			url: "/pages/myAddress/myAddress?action=changeAddr"
		})
	}
})
