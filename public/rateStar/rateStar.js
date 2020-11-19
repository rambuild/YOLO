// components/rateStar.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		rateObject: {
			type: [Number, String],
			default: 0
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		grayScore: 5,
		redScore: 0,
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		giveScore(e) {
			var redIndex = e.currentTarget.dataset.redindex;
			var greyIndex = e.currentTarget.dataset.greyindex;
			
			var m_redScore=this.data.redScore;
			var m_grayScore=this.data.greyScore;

			if (greyIndex != undefined) {
				m_redScore += greyIndex + 1;
				m_grayScore = 5 - m_redScore;
			}
			if (redIndex != undefined) {
				m_redScore = redIndex + 1;
				m_grayScore = 5 - m_redScore;
			}
			
			this.setData({
				redScore:m_redScore,
				grayScore:m_grayScore
			})
			
			// 选中的项目
			// console.log(this.properties.rateObject)
			
			// // console.log('score:',m_redScore)
			// this.$emit('change', {
			// 	value: m_redScore,
			// 	rateObj: this.rateObject,
			// })
			
			this.triggerEvent('changeRate', {
				value:this.data.redScore,
				rateObj:this.properties.rateObject
			})
		},
	}
})
