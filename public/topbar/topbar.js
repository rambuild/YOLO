Component({
  data: {},
  properties: {
    background:{
      type:String,
      value:"black"
    },
    color:{
      type:String,
      value:"black"
    },
    canBack:{
      type:Boolean,
      value:false
    },
    title:{
      type:String,
      value:""
    }
  },
  lifetimes:{
    ready:function(){
      this.getsysInfo();
    }
  },
  methods: {
    getsysInfo(){
      let systemInfo = wx.getSystemInfoSync();
      let menuButton = wx.getMenuButtonBoundingClientRect();
      this.setData({
        systemInfo,
        menuButton,
      })
    }
  },
})