// pages/Invitation/Invitation.js
Page({
	data: {
		index: 1,
		userId: null,
		txFlag: false,
		withdrawal: null,
		withdrawalName: null,
		txDetails: [],//提现明细
		tcDetails:[] //提成明细
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		let userId = wx.getStorageSync("user").id
		this.setData({
			userId
		})
		this.getTxDetails()
		this.getTcDetails()
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () { },
	getTxDetails() {
		wx.http({
			url: "getDetails",
			data: {
				userId: this.data.userId,
				type: 2
			}
		}).then(res => {
			if (res.code == 200) {
				this.setData({
					txDetails: res.data
				})
			}
		})
	},
	getTcDetails(){
		wx.http({
			url: "getDetails",
			data: {
				parentId: this.data.userId,
				type: 1
			}
		}).then(res => {
			if (res.code == 200) {
				this.setData({
					tcDetails: res.data
				})
			}
		})
	},
	ShareGo() {
		wx.navigateTo({
			url: "/pages/Share/Share"
		})
	},
	switchTab(e) {
		this.setData({
			index: e.target.dataset.index
		})
	},
	hideWithdrawBox() {
		this.setData({
			txFlag: false
		})
	},
	// 提现
	withdrawal() {
		this.setData({
			txFlag: true
		})
	},
	radioChange(e) {
		this.setData({
			withdrawalName: e.detail.value
		})
	},
	inputChange(e) {
		this.setData({
			withdrawal: e.detail.value
		})
	},
	cancel() {
		this.setData({
			txFlag: false
		})
	},
	formSubmit(e) {
		let { withdrawal, withdrawalName } = this.data
		if (withdrawal && withdrawalName) {
			wx.http({
				url: "insertDetails",
				data: {
					withdrawal,
					withdrawalName,
					userId: this.data.userId,
					type: 2
				}
			}).then(res => {
				if (res.code == 200) {
					wx.showToast({
						title: "申请提现成功"
					})
					this.setData({
						txFlag: false,
						withdrawal: null
					})
					this.getDetails()
				}
			})
		} else {
			wx.showToast({
				title: '请填写所有的项',
				icon: "none"
			});
		}
	},
	// 阻止事件冒泡
	tx(e) { }
})
