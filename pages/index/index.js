
Page({
  
  onLoad: function () {
  },

  showTwoColumnsDemo: function() {
    wx.navigateTo({
      url: '../recycle-view-demo/recycle-view-demo',
    })
  },

  showOneColumnDemo: function() {
    wx.navigateTo({
      url: '../one-column-demo/one-column-demo',
    })
  }
})
