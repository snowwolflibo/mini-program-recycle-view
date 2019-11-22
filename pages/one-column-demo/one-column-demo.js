// pages/image-list/image-list.js
const createRecycleContext = require('../../recycle-view/index.js')
Page({

  _top: 0, // 下一个item的top值
  _windowWidth: undefined, // 屏幕宽度

  /**
   * 页面的初始数据
   */
  data: {
    baseURL: "http://nicelook-resource-public.naonaola.com/",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isLoading: true
    })

    this.ctx = createRecycleContext({
      id: 'recycleId',
      dataKey: 'recycleList',
      page: this,
      itemSize: function (item, index) {
        return {
          width: item.width,
          height: item.height
        }
      }
    })

    wx.getSystemInfo({
      success: (res) => {
        this._windowWidth = res.windowWidth;
        this.getData();
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  
  getData() {
    this.setData({
      isLoading: true
    })

    const Server = require("../server/server.js")
    Server.postDataToClient()
      .then(result => {
        const appendedDatas = []
        result.forEach(item => {
          // 以下代码实现一行两列
          const horizontalMargin = 15;
          const width = this._windowWidth - 2 * horizontalMargin; // 2为borderWidth
          const imageWidth = width - 2;
          const imageHeight = imageWidth * item.ratio;;
          const labelHeight = 20;
          const itemVerticalPadding = 10;
          const height = labelHeight + imageHeight + 2 * itemVerticalPadding;
          const left = horizontalMargin;
          const appendedData = {
            image: item.image,
            imageWidth: imageWidth,
            imageHeight: imageHeight,
            width: width,
            height: height,
            left: left,
            top: this._top,
          };
          this._top += height;
          appendedDatas.push(appendedData)
        });
        this.ctx.append(appendedDatas)
        this.setData({
          isLoading: false
        })
      })
  },

  onScrollToLower() {
    if(!this.data.isLoading) {
      this.getData()
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  tapImage: function(e) {
    console.log(e);
  }
})

function transformRpx(rpx) {
  return (rpx / 750) * wx.getSystemInfoSync().screenWidth
}
