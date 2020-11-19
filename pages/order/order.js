// pages/order/order.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		navList: ["全部", "待付款", "待发货", "待收货", "待评价", "退款中"],
		currentIndex: 0,
		userId: null,
		openId: null,
		allOrders: [],
		toBePaidList: [], //待付款1
		toBeDeliveredList: [], //待发货2
		toBeReceivedList: [], // 待收货3
		toBeEvaluatedList: [], // 待评价
		refunding: [], // 退款中4
		toBePaidListCheckAll: false, // 判断待付款区是否全选
		totalPrice: 0
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({ currentIndex: options.mark })
		//获取内容区域的高度
		this.getContentHeight()

		let userId = wx.getStorageSync("user").id
		let openId = wx.getStorageSync("user").openId
		this.setData({
			userId,
			openId
		})
	},
	onShow() {
		// 获取全部订单
		this.getOrders()
	},
	navGo(e) {
		let index = e.currentTarget.dataset.index
		this.setData({
			currentIndex: index
		})
	},
	getOrders() {
		wx.http({
			url: "getOrder",
			loading: true,
			data: {
				userId: this.data.userId
			}
		}).then(res => {
			if (res.code == 200) {
				let allOrders = res.data
				let toBePaidList = []
				let toBeDeliveredList = []
				let toBeReceivedList = []
				let toBeEvaluatedList = []
				let refunding = []
				// 分类各种状态的订单
				res.data.forEach(i => {
					if (i.status == 1) {
						toBePaidList.push(i)
					} else if (i.status == 2) {
						toBeDeliveredList.push(i)
					} else if (i.status == 3) {
						toBeReceivedList.push(i)
					} else if (i.status == 6) {
						toBeEvaluatedList.push(i)
					} else if (i.status == 4) {
						refunding.push(i)
					}
				})
				let evaluateList = []
				toBeEvaluatedList.forEach(i => {
					if (i.orderInfoList.length > 0) {
						i.orderInfoList.forEach(j => {
							evaluateList.push(j)
						})
					}
				})
				// 数组倒置，使最新的订单前置
				allOrders = allOrders.reverse()
				toBePaidList = toBePaidList.reverse()
				toBeDeliveredList = toBeDeliveredList.reverse()
				toBeReceivedList = toBeReceivedList.reverse()
				toBeEvaluatedList = toBeEvaluatedList.reverse()
				refunding = refunding.reverse()
				this.setData({
					allOrders,
					toBePaidList,
					toBeDeliveredList,
					toBeReceivedList,
					toBeEvaluatedList:evaluateList,
					refunding
				})
			} else {
				wx.showToast({
					title: "获取订单信息失败",
					icon: "none"
				})
			}
		})
	},
	//内容区域的高度
	getContentHeight() {
		let clientHeight = 0
		//获取手机的高度
		wx.getSystemInfo({
			success: res => {
				clientHeight = res.windowHeight
			}
		})
		//手机高度-导航栏高度==内容区域的高度
		var obj = wx.createSelectorQuery()
		obj.selectAll("#navigation").boundingClientRect()
		obj.exec(res => {
			let height = res[0][0].height
			this.setData({
				orderHeight: clientHeight - height
			})
		})
	},
	//滚动
	switchTab(e) {
		this.setData({
			currentIndex: e.detail.current
		})
	},
	// // 待付款区域勾选/反选订单
	// selectItem(e) {
	// 	let selIndex = e.currentTarget.dataset.index
	// 	let toBePaidList = JSON.parse(JSON.stringify(this.data.toBePaidList))
	// 	toBePaidList.forEach((i, index) => {
	// 		if (selIndex == index) {
	// 			i.selected == 0 ? (i.selected = 1) : (i.selected = 0)
	// 		}
	// 	})
	// 	// 判断是否全选
	// 	let bool = true
	// 	toBePaidList.forEach(i => {
	// 		if (i.orderInfoList.length > 0 && i.selected == 0) {
	// 			bool = false
	// 		}
	// 	})
	// 	bool ? this.setData({ toBePaidListCheckAll: true }) : this.setData({ toBePaidListCheckAll: false })
	// 	this.setData({
	// 		toBePaidList
	// 	})
	// 	// 计算总价
	// 	this.calcTotal()
	// },
	// // 待付款区域勾选/反选全部
	// selectAll() {
	// 	let toBePaidList = JSON.parse(JSON.stringify(this.data.toBePaidList))
	// 	let { toBePaidListCheckAll } = this.data
	// 	if (toBePaidListCheckAll) {
	// 		toBePaidList.forEach(i => {
	// 			if (i.orderInfoList.length > 0) {
	// 				i.selected = 0
	// 			}
	// 		})
	// 	} else {
	// 		toBePaidList.forEach(i => {
	// 			if (i.orderInfoList.length > 0) {
	// 				i.selected = 1
	// 			}
	// 		})
	// 	}
	// 	let bool = true
	// 	toBePaidList.forEach(i => {
	// 		if (i.orderInfoList.length > 0 && i.selected == 0) {
	// 			bool = false
	// 		}
	// 	})
	// 	bool ? this.setData({ toBePaidListCheckAll: true }) : this.setData({ toBePaidListCheckAll: false })
	// 	this.setData({
	// 		toBePaidList
	// 	})
	// 	// 计算总价
	// 	this.calcTotal()
	// },
	// // 待付款区域根据选中状态计算总价
	// calcTotal() {
	// 	let totalPrice = 0
	// 	let toBePaidList = JSON.parse(JSON.stringify(this.data.toBePaidList))
	// 	toBePaidList.forEach(i => {
	// 		if (i.orderInfoList.length > 0 && i.selected == 1) {
	// 			totalPrice += i.price
	// 		}
	// 	})
	// 	this.setData({
	// 		totalPrice
	// 	})
	// },
	// 删除订单
	delOrder(e) {
		let { action } = e.currentTarget.dataset
		let content = action == "cancel" ? "取消" : "删除"
		wx.showModal({
			title: "提示",
			content: `确定${content}此订单？`,
			showCancel: true,
			cancelText: "取消",
			cancelColor: "#000000",
			confirmText: "确定",
			confirmColor: "#3CC51F",
			success: result => {
				if (result.confirm) {
					console.log(e.currentTarget.dataset.orderid)
					let orderId = e.currentTarget.dataset.orderid
					wx.http({
						url: "updateOrder",
						data: {
							id: orderId,
							isDelete: 2
						}
					}).then(res => {
						if (res.code == 200) {
							this.getOrders()
							wx.showToast({
								title: `${content}成功`
							})
						}
					})
				}
			},
			fail: () => {},
			complete: () => {}
		})
	},
	// 付款
	payment(e) {
		let { item } = e.currentTarget.dataset
		//状态为1表示待付款状态
		if (item.status == 1) {
			wx.showModal({
				title: "提示",
				content: "确认付款？",
				success: res => {
					if (res.confirm) {
						wx.http({
							url: "prepay",
							data: {
								qorderid: item.orderId,
								qgmopenid: this.data.openId,
								qsum: item.price
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
										if (res.errMsg == "requestPayment:ok") {
											this.getOrders()
											wx.showToast({
												title: "支付成功"
											})
										}
									},
									fail: res => {
										wx.showToast({
											title: "支付失败",
											icon: "none"
										})
									}
								})
							} else {
								wx.showToast({
									title: "出错了",
									icon: "none"
								})
							}
						})
					} else if (res.cancel) {
					}
				}
			})
		}
	},
	// 申请退款
	applyForRefund(e) {
		let { item } = e.currentTarget.dataset
		wx.showModal({
			title: "提示",
			content: "确认申请退款？",
			success: res => {
				if (res.confirm) {
					wx.http({
						url: "updateOrder",
						data: {
							id: item.id,
							status: 4
						}
					}).then(res => {
						if (res.code == 200) {
							this.getOrders()
							wx.showToast({
								title: "申请成功"
							})
						}
					})
				}
			}
		})
	},
	// 确认收货
	confirmReceive(e) {
		let { item } = e.currentTarget.dataset
		wx.showModal({
			title: "提示",
			content: "是否确认收货？",
			success: res => {
				if (res.confirm) {
					wx.http({
						url: "updateOrder",
						data: {
							id: item.id,
							status: 6
						}
					}).then(res => {
						if (res.code == 200) {
							this.getOrders()
							wx.showToast({
								title: "收货成功"
							})
						}
					})
				}
			}
		})
	},
	// 订单评价
	toEvaluate(e) {
		let { item } = e.currentTarget.dataset
		wx.navigateTo({
			url: `/pages/goodsEvaluate/goodsEvaluate?item=${encodeURIComponent(JSON.stringify(item))}`
		})
	}
})
