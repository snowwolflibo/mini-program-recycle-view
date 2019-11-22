/* eslint complexity: ["error", {"max": 50}] */
const recycleData = require('./recycle-data.js')

module.exports = function (e, cb) {
  const detail = e.detail
  // console.log('data change transfer use time', Date.now() - e.detail.timeStamp)
  let newList = []
  const item = recycleData[detail.id]
  // 边界值判断, 避免造成异常, 假设先调用了createRecycleContext, 然后再延迟2s调用append插入数据的情况
  if (!item || !item.list) return
  const dataList = item.list
  const pos = detail.data
  const beginIndex = pos.beginIndex
  const endIndex = pos.endIndex
  item.pos = pos
  // 加ignoreBeginIndex和ignoreEndIndex
  if (typeof beginIndex === 'undefined' || beginIndex === -1 || typeof endIndex === 'undefined' || endIndex === -1) {
    newList = []
  } else {
    let i = -1
    for (i = beginIndex; i < dataList.length && i <= endIndex; i++) {
      if (i >= pos.ignoreBeginIndex && i <= pos.ignoreEndIndex) continue
      newList.push(dataList[i])
    }
  }


  // Modify By Neo Li @2019-11-22 Begin ==================
  // 采用“最大不变性原则”对newList进行修改，确保原本存在的item仍位于相应的位置，不存在的item添加到列表末端。以此确保已存在的item尽可能被相同index的数据重用
  if (newList.length) {
    var oldData = recycleData.oldData;
    console.log(oldData)
    var beginItemInNewList = newList[0];
    var endItemInNewList = newList[newList.length - 1];
    if (oldData && oldData.list && oldData.list.length) {
      var oldList = oldData.list;
      var unusedPositionInOldList = [];
      // 将oldList中不再使用的位置记录下来，放到unusedPositionInOldList中，以便往里面插入新数据
      oldList.forEach((oldItem, position) => {
        if (oldItem.__index__ > endItemInNewList.__index__ || oldItem.__index__ < beginItemInNewList.__index__) {
          unusedPositionInOldList.push(position);
        }
      });
      // 如果oldList中有位置则插入到该位置，否则添加到末端
      var addNewItemIntoOldList = (positionInNewListForInsertingIntoOldList) => {
        var itemInNewListForInsertingIntoOldList = newList[positionInNewListForInsertingIntoOldList];
        if (unusedPositionInOldList.length) {
          var index = unusedPositionInOldList.pop();
          oldList.splice(index, 1, itemInNewListForInsertingIntoOldList);
        } else {
          oldList.push(itemInNewListForInsertingIntoOldList);
        }
      }
      var positionInNewListForInsertingIntoOldList = 0;
      for (let i = beginItemInNewList.__index__; i < oldData.beginIndex; i++) {
        addNewItemIntoOldList(positionInNewListForInsertingIntoOldList++);
      }
      positionInNewListForInsertingIntoOldList = newList.length - 1;
      for (let i = oldData.endIndex + 1; i <= endItemInNewList.__index__; i++) {
        addNewItemIntoOldList(positionInNewListForInsertingIntoOldList--);
      }
      newList = oldList;
    }
    recycleData.oldData = {
      list: newList,
      beginIndex: beginItemInNewList.__index__,
      endIndex: endItemInNewList.__index__
    };
  }
  // Modify By Neo Li @2019-11-22 End ==================

  const obj = {
    // batchSetRecycleData: !this.data.batchSetRecycleData
  }
  obj[item.key] = newList
  const comp = this.selectComponent('#' + detail.id)
  obj[comp.data.batchKey] = !this.data.batchSetRecycleData
  comp._setInnerBeforeAndAfterHeight({
    beforeHeight: pos.minTop,
    afterHeight: pos.afterHeight
  })
  this.setData(obj, () => {
    if (typeof cb === 'function') {
      cb()
    }
  })
  // Fix #1
  // 去掉了batchSetDataKey，支持一个页面内显示2个recycle-view
  // const groupSetData = () => {
  //   this.setData(obj)
  //   comp._recycleInnerBatchDataChanged(() => {
  //     if (typeof cb === 'function') {
  //       cb()
  //     }
  //   })
  // }
  // if (typeof this.groupSetData === 'function') {
  //   this.groupSetData(groupSetData)
  // } else {
  //   groupSetData()
  // }
}
