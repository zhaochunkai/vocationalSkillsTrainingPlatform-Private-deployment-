import { time, getLabel } from './method'

const filter = {
  // 时间格式
  timeFormat (date, format) {
    return time.format(date, format)
  },
  formatAllDate (date) {
    return time.format(date, 'yyyy-MM-dd hh:mm:ss')
  },
  formatDate (date) {
    return time.format(date, 'yyyy-MM-dd')
  },
  formatDate_1 (date) {
    return time.format(date, 'yyyy年MM月dd日')
  },
  date (timestamp) {
    return new Date(timestamp * 1000)
  },

  // 秒数转换为 hh时mm分ss秒 格式
  numToSFM (value) {
    let result = parseInt(value)
    let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
    let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
    let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))
    let res = ''
    if (h !== '00') res += `${h}时`
    if (m !== '00') res += `${m}分`
    res += `${s}秒`
    return res
  },
  // 保留小数
  toFixed (number, digit) {
    if (number === undefined) return 0
    return (+number).toFixed(digit || 0)
  },

  // 通过值获取
  getLabel (value, list, valueKey, labelKey) {
    return getLabel(value, list, valueKey, labelKey)
  },
  // 下载二进制流文件
  downloadBlobFile (content, filename) {
    let blob = new Blob([content])
    const a = document.createElement('a')
    const url = window.URL.createObjectURL(blob)
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }
}

export default filter
