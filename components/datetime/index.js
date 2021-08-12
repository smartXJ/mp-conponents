// components/datetime/index.js
import dateFormat from '../../utils/date-format'

const getList = (start, end)  => {
  const list = []
  for (let index = 0; index <= (end - start); index++) {
    list.push(start + index)
  }
  return list.map(item => {
    if (item < 10) return '0' + item
    return item + ''
  })
}

const datetime = {
  getYears: (minYear, maxYear) => {
    const start = minYear ? +minYear : 2019
    const end = maxYear ? +maxYear : new Date().getFullYear() + 2
    return getList(start, end)
  },
  getMonths: () => {
    return getList(1, 12)
  },
  // 天数不确定需要计算 传入year month
  getDays: (year, month) => {
    const lastDay = new Date(year, month, 0).getDate()
    return getList(1, lastDay)
  },
  getHours: () => {
    return getList(0, 23)
  },
  getMinutes: () => {
    return getList(0, 59)
  },
  getSeconds: () => {
    return getList(0, 59)
  }
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: String,
    format: {
      type: String,
      value: 'YY-MM-DD hh:mm:ss'
    },
    name: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    timeList: [
      datetime.getHours(),
      datetime.getMinutes(),
      datetime.getSeconds(),
    ],
    dateList: [
      datetime.getYears(),
      datetime.getMonths(),
      []
    ],
    date: [0, 0, 0],
    time: [0, 0, 0]
  },

  observers: {
    value (v) {
      const dt = v ? new Date(v) : new Date()
      const year = dt.getFullYear()
      const month = dt.getMonth() + 1
      const day = dt.getDate()
      const days = datetime.getDays(year, month)
      const [ years, months ] = this.data.dateList
      const date = [
        // 将数据转化成number类型 再进行判断
        years.map(item => +item).indexOf(year),
        // 将数据转化成number类型 再进行判断
        months.map(item => +item).indexOf(month),
        // 将数据转化成number类型 再进行判断
        days.map(item => +item).indexOf(day)
      ]
      this.setData({
        date, 'dateList[2]': days
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onCancel () {
      // 取消
      this.triggerEvent('cancel')
    },
    onConfirm () {
      // console.log('confirm');
      const { year, month, day, hour, minute, second } = this.getDateTimeValue()
      const value = year + '-' + month + '-'+ day + ' '+ hour + ':'+ minute + ':'+ second
      const { format, name } = this.properties
      const data = {
        value: dateFormat(value, format),
        name
      }
      // 更新value
      this.setData({ value: data.value })
      // 父组件 逻辑
      this.triggerEvent('confirm', data)
    },
    bindChangeDate (e) {
      let [year, month, day] = e.detail.value
      const dt = this.getDateTimeValue({ year, month })
      // console.log(datetime, 'datetime');
      const days = datetime.getDays(dt.year, dt.month)
      // 若day 大于 days 的长度
      if (day > days.length - 1) day = days.length - 1
      this.setData({
        date: [year, month, day],
        'dateList[2]': days
      })
    },
    bindChangeTime (e) {
      const [hour, minute, second] = e.detail.value
      this.setData({
        time: [hour, minute, second]
      })
    },
    getDateTimeValue (datetime = {}) {
      let { date: [ year, month, day ], time: [hour, minute, second], dateList: [years, months, days], timeList: [hours, minutes, seconds] } = this.data
      return {
        year: years[ datetime.year || year],
        month: months[datetime.month || month],
        day: days[day],
        hour: hours[hour],
        minute: minutes[minute],
        second: seconds[second],
      }
    }
  }
})
