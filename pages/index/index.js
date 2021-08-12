// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    datetime: '2021-02-03 12:12:12'
  },
  confirm (e) {
    // const { value, name } = e.detail
    console.log(e, 'e');
    console.log('confirm');
  },
  cancel () {
    console.log('cancel');
  }
})
