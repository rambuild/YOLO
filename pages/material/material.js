Page({
    data:{
        tab:0,
        line:{
            left:50,
            width:50
        },
        tabbar:[{
            text:'传图',
            icon:'/static/icon/chuantu.png',
            select:'/static/icon/chuantu-select.png'
        },{
            text:'模板',
            icon:'/static/icon/muban.png',
            select:'/static/icon/muban-select.png'
        },{
            text:'素材',
            icon:'/static/icon/sucai.png',
            select:'/static/icon/sucai-select.png'
        },{
            text:'文本',
            icon:'/static/icon/wenben.png',
            select:'/static/icon/wenben-select.png'
        }],
        tabbarIndex:0
    },
    onLoad:function(){
        let selQuery = wx.createSelectorQuery();
        selQuery.selectAll(".scroll-item").fields({size:true,rect:true}).exec(res=>{
            this.data.node = res[0];
            this.data.line.width = res[0][0].width*0.8;
            this.data.line.left = res[0][0].width*0.1;
            this.setData({
                line:this.data.line
            })
        })
    },
    animationTab(e){
        let index = e.currentTarget.dataset.tab;
        this.data.line.left = this.data.node[index].left+this.data.node[index].width*0.1;
        this.data.line.width = this.data.node[index].width*0.8;
        this.setData({
            tab:index,
            line:this.data.line
        })
    },
    changeCustomTab(e){
        this.setData({
            tabbarIndex : e.currentTarget.dataset.tab
        })
    }
})