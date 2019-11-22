// pages/image-list/image-list.js
const createRecycleContext = require('../../recycle-view/index.js')
Page({

  _top: 0, // 下一个item的top值
  _itemCount: 0, // 当前已经加载的item数量
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
          const middleSpacing = 10;
          const width = (this._windowWidth - 2 * horizontalMargin - middleSpacing) / 2; // 2为borderWidth
          const imageWidth = width - 2;
          const imageHeight = 120;
          const labelHeight = 20;
          const itemVerticalPadding = 10;
          const height = labelHeight + imageHeight + 2 * itemVerticalPadding;
          const left = this._itemCount % 2 === 0 ? horizontalMargin : horizontalMargin + width + middleSpacing;
          const appendedData = {
            myid: this._itemCount,
            image: item.image,
            imageWidth: imageWidth,
            imageHeight: imageHeight,
            width: width,
            height: height,
            left: left,
            top: this._top,
          };
          // 如果不需要支付一行多列，则将left设置为固定值，并忽略_itemCount，直接累计_top即可
          if (this._itemCount % 2 === 1) {
            this._top += height;
          }
          this._itemCount++;
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
