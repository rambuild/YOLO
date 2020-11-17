// pages/test/test.js
var canOnePointMove = true
// 移动图片的手指的坐标
var onePoint = {
    x1: 0,
    y1: 0,
}
// 旋转图片两根手指的坐标
var twoPoint = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
}
Page({
    data: {
        center: "center",
        image_src: "", // 背景图片路径
        drag_box_image: "", // 上传图片路径
        drag_box_top: "", // 拖拽盒子的定位
        drag_box_left: "",
        translateX: 0,
        translateY: 0,
        img_origin: 0, // 图片的旋转角度
        activesize: 1, // 图片的放大缩小倍数
        drag_box_image_top: 0, // 图片的上位移
        drag_box_image_left: 0, // 图片左位移
        image_originY: 0, // 图片旋转的角度
        style_chuantu: true, // 传图条件渲染
        style_moban: false, // 模板的条件渲染
        style_cdr: false, // 素材的条件渲染
        style_font: false, // 文本的条件渲染
        image: false, //插入图片条件渲染
        bar_upload_image: "/static/icon/图片未选中.png", // 传图的图标
        bar_upload_moban: "/static/icon/模板未选中.png", // 模板的图标
        bar_upload_cdr: "/static/icon/素材未选中.png", // 素材的图标
        bar_upload_font: "/static/icon/文本未选中.png", // 文本的图标
        moban_block: ["推荐模板", "文艺风", "卡通风", "更多"], // 模板的数据
        bar_block: ["推荐素材", "文字", "心情", "萌萌哒", "love", "主题", "更多"], // 素材的数据
        font_block: ["输入文字", "颜色", "左右居中", "确定"], // 文本的数据
        font_index: 0, // 文本的索引
        bar_index: 0, // 素材的索引
        moban_index: 0, // 模板的索引
        font_box_show: false, // 文本框功能按钮的显示与隐藏
        font_btn_show: false, //整个文本框区域的显示和隐藏
        font_text_show: false, //可输入文本框的显示和隐藏
        font_view_show: false, //渲染到盒子上的文字显示和隐藏
        font_text_origin: 0, // 文本框旋转角度
        font_text_originY: 0, // 文本框镜像旋转
        textSize: 1, //文本框缩放倍数
        font_box_top: 93, //文本框上定位位置
        font_box_left: 76, //文本框左定位位置
        font_size: 160, //文本框初始字体大小
        message: "", //文本框渲染到盒子的内容
        text_align: "",
        vertical_align: "",
        rgb: "rgb(0,154,97)", //初始值
        pick: false, //取舍器显示与隐藏
        text_show: true, //输入文字显示隐藏
        color_show: false, //颜色显示与隐藏
        fetchOptions: {},
    },
    onLoad(options) {
        let imgs = JSON.parse(decodeURIComponent(options.imgs))
        let obj = Object.assign({ imgs }, { size: options.size }, { goodsId: options.goodsId })
        console.log(obj.imgs.img1)
        this.data.fetchOptions = obj
        this.data.image_src = obj.imgs.img1
    },
    handleimage_box_show() {
        this.setData({
            image_box_show: !this.data.image_box_show,
            font_box_show: this.data.image_box_show,
        })
    },
    toOrder(){
        console.log('a')
        wx.navigateTo({
            url:''
        })
    },
    // 上传图片
    handleuploadimages() {
        wx.chooseImage({
            count: 1,
            success: (res) => {
                // console.log(res);
                this.setData({
                    image: true,
                    style_chuantu: true,
                    style_moban: false,
                    style_cdr: false,
                    style_font: false,
                    drag_box_image: res.tempFiles[0].path,
                    bar_upload_image: "/static/icon/图片选中.png",
                    bar_upload_moban: "/static/icon/模板未选中.png",
                    bar_upload_cdr: "/static/icon/素材未选中.png",
                    bar_upload_font: "/static/icon/文本未选中.png",
                    image_box_show: true,
                })
            },
        })
    },
    // 图片镜面翻转功能
    image_mirror(e) {
        this.setData({
            image_originY: this.data.image_originY + 180,
        })
    },
    // 拖拽盒子内图片旋转开始
    img_touchoriginstart(e) {
        console.log(e)
        onePoint.x1 = e.touches[0].pageX
        onePoint.y1 = e.touches[0].pageY
    },
    // 拖拽盒子内图片旋转开始
    img_touchorigin(e) {
        // console.log(e);
        var onpointorigin = JSON.parse(JSON.stringify(onePoint))
        var orogin_box_X = e.touches[0].pageX - onePoint.x1
        var orogin_box_Y = e.touches[0].pageY - onePoint.y1
        // 旋转的角度
        var moveorigin = (Math.atan(orogin_box_Y / orogin_box_X) * 360) / Math.PI
        this.setData({
            img_origin: moveorigin,
        })
        onpointorigin.x1 = e.touches[0].pageX
        onpointorigin.y1 = e.touches[0].pageY
    },
    // 图片放大缩小尺寸
    img_touchSizeUpStart(e) {
        console.log(e)
        onePoint.x1 = e.touches[0].pageX
        onePoint.y1 = e.touches[0].pageY
    },
    // 图片的放大缩小
    img_touchSizeDownmove(e) {
        // console.log(e);
        let imageSize = (e.touches[0].pageY - onePoint.y1) * 0.008
        if (imageSize < -1) {
            imageSize = -0.8
        }
        if (imageSize > 6) {
            imageSize = 6
        }
        this.setData({
            activesize: imageSize + 1,
        })
        console.log(this.data.activesize)
    },
    // 删除图片
    handleClose(e) {
        // console.log(e);
        this.setData({
            drag_box_image: "",
            img_origin: 0,
            activesize: 1,
            drag_box_image_top: 0,
            drag_box_image_left: 0,
            image_originY: 0,
            bar_upload_image: "/static/icon/图片未选中.png",
            image_box_show: false,
        })
    },
    // 图片移动
    img_touchstart(e) {
        console.log(e)
        if (e.touches.length < 2) {
            onePoint.x1 = e.touches[0].pageX
            onePoint.y1 = e.touches[0].pageY
        } else if (e.touches.length > 1) {
            twoPoint.x1 = e.touches[0].pageX
            twoPoint.y1 = e.touches[0].pageY
            twoPoint.x2 = e.touches[1].pageX
            twoPoint.y2 = e.touches[1].pageY
        }
    },
    img_touchmove(e) {
        console.log(e)
        if (this.data.image_box_show && e.touches.length < 2) {
            var img_moveX = e.touches[0].pageX - onePoint.x1
            var img_moveY = e.touches[0].pageY - onePoint.y1
            this.setData({
                drag_box_image_top: this.data.drag_box_image_top + img_moveY,
                drag_box_image_left: this.data.drag_box_image_left + img_moveX,
            })
            onePoint.x1 = e.touches[0].pageX
            onePoint.y1 = e.touches[0].pageY
        } else if (this.data.image_box_show && e.touches.length > 1) {
            // 先将字符串转化为json数据，再将json数据转化为对象
            var preTwoPoint = JSON.parse(JSON.stringify(twoPoint))
            twoPoint.x1 = e.touches[0].pageX
            twoPoint.y1 = e.touches[0].pageY
            twoPoint.x2 = e.touches[1].pageX
            twoPoint.y2 = e.touches[1].pageY
            // 计算角度，旋转(优先)
            var perAngle =
                (Math.atan((preTwoPoint.y1 - preTwoPoint.y2) / (preTwoPoint.x1 - preTwoPoint.x2)) * 360) / Math.PI
            var curAngle = (Math.atan((twoPoint.y1 - twoPoint.y2) / (twoPoint.x1 - twoPoint.x2)) * 360) / Math.PI
            if (Math.abs(perAngle - curAngle) > 1) {
                this.setData({
                    img_origin: this.data.img_origin + (curAngle - perAngle),
                })
            } else {
                // 计算距离，缩放
                var preDistance = Math.sqrt(
                    Math.pow(preTwoPoint.x1 - preTwoPoint.x2, 2) + Math.pow(preTwoPoint.y1 - preTwoPoint.y2, 2)
                )
                var curDistance = Math.sqrt(
                    Math.pow(twoPoint.x1 - twoPoint.x2, 2) + Math.pow(twoPoint.y1 - twoPoint.y2, 2)
                )
                this.setData({
                    activesize: this.data.activesize + (curDistance - preDistance) * 0.05,
                })
            }
        }
    },
    // 点击模板功能
    handle_moban() {
        this.setData({
            style_moban: true,
            style_font: false,
            style_cdr: false,
            style_chuantu: false,
            bar_upload_moban: "/static/icon/模板选中.png",
            bar_upload_cdr: "/static/icon/素材未选中.png",
            bar_upload_font: "/static/icon/文本未选中.png",
        })
    },
    // 点击素材功能
    handle_cdr() {
        this.setData({
            style_moban: false,
            style_font: false,
            style_cdr: true,
            style_chuantu: false,
            bar_upload_moban: "/static/icon/模板未选中.png",
            bar_upload_font: "/static/icon/文本未选中.png",
            bar_upload_cdr: "/static/icon/素材选中.png",
        })
    },
    // 点击文本功能
    handle_font() {
        this.setData({
            style_moban: false,
            style_cdr: false,
            style_chuantu: false,
            style_font: true,
            bar_upload_moban: "/static/icon/模板未选中.png",
            bar_upload_cdr: "/static/icon/素材未选中.png",
            bar_upload_font: "/static/icon/文本选中.png",
            font_btn_show: true,
        })
        if (this.data.image_box_show) {
            this.setData({
                font_box_show: true,
                image_box_show: false,
            })
        }
    },
    // 背面
    handel_image_negative() {
        this.setData({
            image_src: this.data.fetchOptions.imgs.img2,
        })
    },
    // 正面
    handel_image_positive() {
        this.setData({
            image_src: this.data.fetchOptions.imgs.img1,
        })
    },
    // 模板的逻辑
    getstyle_moban(e) {
        console.log(e)
        let index = e.currentTarget.dataset.index
        this.setData({
            moban_index: index,
        })
        if (index == 3) {
            wx.navigateTo({
                url: "../template/template",
            })
        }
    },
    // 素材的逻辑
    getstyle_cdr(e) {
        console.log(e)
        let index = e.currentTarget.dataset.index
        this.setData({
            bar_index: index,
        })
    },

    // 文本的逻辑
    getstyle_font(e) {
        console.log(e)
        let index = e.currentTarget.dataset.index
        this.setData({
            font_index: index,
        })
        if (index == 0) {
            this.setData({
                text_show: true,
                color_show: false,
            })
        }
        if (index == 1) {
            this.setData({
                text_show: false,
                color_show: true,
            })
        }
        if ((index = 2)) {
            this.setData({
                text_align: "center",
                vertical_align: "",
            })
        }
        if (index == 3) {
            this.setData({
                font_btn_show: false,
            })
        }
    },

    handlefontshow() {
        this.setData({
            font_btn_show: !this.data.font_btn_show,
            font_text_show: this.data.font_btn_show,
            font_view_show: !this.data.font_btn_show,
        })
    },
    //文本框输入的时候
    bindinput(e) {
        console.log(e)
        var font_length = e.detail.cursor
        this.setData({
            message: e.detail.value,
            center: "center",
        })
        if (font_length < 2) {
            this.setData({
                font_size: 160,
            })
        } else {
            this.setData({
                font_size: 200 / font_length,
            })
        }
    },
    bindfocus() {
        this.setData({
            center: "center",
        })
    },
    // 文本框退出按钮
    handleTextClear() {
        this.setData({
            message: "",
            font_box_show: false,
            font_size: 160,
            font_text_originY: 0,
            font_text_origin: 0,
            textSize: 1,
        })
    },
    text_touchorigin(e) {
        // console.log(e);
        var onpointorigin = JSON.parse(JSON.stringify(onePoint))
        var orogin_box_X = e.touches[0].pageX - onePoint.x1
        var orogin_box_Y = e.touches[0].pageY - onePoint.y1
        // 旋转的角度
        var moveorigin = (Math.atan(orogin_box_Y / orogin_box_X) * 360) / Math.PI
        this.setData({
            font_text_origin: moveorigin,
        })
        onpointorigin.x1 = e.touches[0].pageX
        onpointorigin.y1 = e.touches[0].pageY
    },
    // 文本框镜面翻转
    handleTextFace() {
        this.setData({
            font_text_originY: this.data.font_text_originY + 180,
        })
    },
    handleTextSize1(e) {
        console.log(e)
        onePoint.x1 = e.touches[0].pageX
        onePoint.y1 = e.touches[0].pageY
    },
    // 文本框缩放功能
    handleTextSize2(e) {
        console.log(e)
        let imageSize = (e.touches[0].pageY - onePoint.y1) * 0.008
        if (imageSize < -1) {
            imageSize = -0.8
        }
        if (imageSize > 6) {
            imageSize = 6
        }
        this.setData({
            textSize: imageSize + 1,
        })
        console.log(this.data.textSize)
    },
    toPick: function () {
        this.setData({
            pick: true,
        })
    },

    //取色结果回调
    pickColor(e) {
        let rgb = e.detail.color
        this.setData({
            rgb: rgb,
        })
    },
    // 文本框移动功能
    text_box_touchstart(e) {
        console.log(e)
        if (e.touches.length < 2) {
            onePoint.x1 = e.touches[0].pageX
            onePoint.y1 = e.touches[0].pageY
        } else if (e.touches.length > 1) {
            twoPoint.x1 = e.touches[0].pageX
            twoPoint.y1 = e.touches[0].pageY
            twoPoint.x2 = e.touches[1].pageX
            twoPoint.y2 = e.touches[1].pageY
        }
    },
    // 文本框移动加旋转功能
    text_box_touchmove(e) {
        console.log(e)
        if (e.touches.length < 2) {
            var img_moveX = e.touches[0].pageX - onePoint.x1
            var img_moveY = e.touches[0].pageY - onePoint.y1
            this.setData({
                font_box_top: this.data.font_box_top + img_moveY,
                font_box_left: this.data.font_box_left + img_moveX,
            })
            onePoint.x1 = e.touches[0].pageX
            onePoint.y1 = e.touches[0].pageY
        } else if (e.touches.length > 1) {
            // 先将字符串转化为json数据，再将json数据转化为对象
            var preTwoPoint = JSON.parse(JSON.stringify(twoPoint))
            twoPoint.x1 = e.touches[0].pageX
            twoPoint.y1 = e.touches[0].pageY
            twoPoint.x2 = e.touches[1].pageX
            twoPoint.y2 = e.touches[1].pageY
            // 计算角度，旋转(优先)
            var perAngle =
                (Math.atan((preTwoPoint.y1 - preTwoPoint.y2) / (preTwoPoint.x1 - preTwoPoint.x2)) * 360) / Math.PI
            var curAngle = (Math.atan((twoPoint.y1 - twoPoint.y2) / (twoPoint.x1 - twoPoint.x2)) * 360) / Math.PI
            if (Math.abs(perAngle - curAngle) > 1) {
                // this.setData({
                //   img_origin: this.data.img_origin + (curAngle - perAngle)
                // })
            } else {
                // 计算距离，缩放
                var preDistance = Math.sqrt(
                    Math.pow(preTwoPoint.x1 - preTwoPoint.x2, 2) + Math.pow(preTwoPoint.y1 - preTwoPoint.y2, 2)
                )
                var curDistance = Math.sqrt(
                    Math.pow(twoPoint.x1 - twoPoint.x2, 2) + Math.pow(twoPoint.y1 - twoPoint.y2, 2)
                )
                this.setData({
                    textSize: this.data.textSize + (curDistance - preDistance) * 0.05,
                })
            }
        }
    },
})
