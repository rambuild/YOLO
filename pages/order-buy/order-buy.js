// 自定义计算方法，处理JS计算小数的精度问题
import calc from "../../utils/calc"
import { imgHost } from "../../utils/http"
Page({
	data: {
		user: {},
		orderList: [],
		userDefaultAddr: {},
		totalPrice: 0,
		addrFlag:true,
		imgHost:null
	},
	onLoad(options) {
		let orderList = JSON.parse(decodeURIComponent(options.orderList))
		// 计算总价
		let totalPrice = 0
		orderList.forEach(i => {
			totalPrice = calc.add(totalPrice, calc.mul(i.price, i.num))
		})
		let user = wx.getStorageSync("user")
		this.setData({
			user,
			orderList,
			totalPrice,
			imgHost
		})
	},
	onShow() {
		this.getUserAddr()
	},
	getUserAddr() {
		wx.http({
			url: "getAddress",
			loading: true,
			data: {
				userId: this.data.user.id
			}
		}).then(res => {
			let userDefaultAddr = {}
			res.data.forEach(i => {
				if (i.type == 2) {
					userDefaultAddr = i
				}
			})
			let addrFlag = true
			Object.keys(userDefaultAddr).length == 0 ? addrFlag = false : addrFlag = true
			this.setData({
				userDefaultAddr,
				addrFlag
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
							}).then(res => {
								if (res.code == 200) {
									let data = res.data
									// 调起微信支付
									wx.requestPayment({
										nonceStr: data.nonceStr,
										package: data.package,
										paySign: data.paySign,
										timeStamp: data.timeStamp,
										signType: data.signType,
										appId: data.prepayId,
										success: res => {
											// 支付成功
											if (res.errMsg == "requestPayment:ok") {
												console.log("支付成功")
												wx.switchTab({
													url: "/pages/car/car"
												})
											}
										},
										fail: res => {
											// 支付失败
											console.log("支付失败")
											wx.switchTab({
												url: "/pages/car/car"
											})
										}
									})
								}
							})
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
	// 没有地址的情况下去添加地址
	toAddAddr(){
		wx.navigateTo({
			url:"/pages/address/address"
		})
	},
	selAddr() {
		wx.navigateTo({
			url: "/pages/myAddress/myAddress?action=changeAddr"
		})
	}
})
