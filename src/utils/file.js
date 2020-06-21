export function myBrowser () {
  const userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
  const isOpera = userAgent.indexOf('Opera') > -1
  if (isOpera) {
    return 'Opera'
  }; // 判断是否Opera浏览器
  if (userAgent.indexOf('Firefox') > -1) {
    return 'FF'
  } // 判断是否Firefox浏览器
  if (userAgent.indexOf('Chrome') > -1) {
    return 'Chrome'
  }
  if (userAgent.indexOf('Safari') > -1) {
    return 'Safari'
  } // 判断是否Safari浏览器
  if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) {
    return 'IE'
  }; // 判断是否IE浏览器
  if (userAgent.indexOf('Trident') > -1) {
    return 'Edge'
  } // 判断是否Edge浏览器
}

export function downloadFile (data, name = 'excel.xlsx') {
  if (!data) {
    return
  }
  const blob = new Blob([data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
  })
  const fileName = `${name}`
  window.URL = window.URL || window.webkitURL
  const url = window.URL.createObjectURL(blob)
  if ('download' in document.createElement('a')) { // 非IE下载
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link) // 下载完成移除元素
    window.URL.revokeObjectURL(url) // 释放掉blob对象
  } else if (myBrowser() === 'IE' || myBrowser() === 'Edge') {
    const oPop = window.open(url, '', 'width=1, height=1, top=5000, left=5000')
    for (; oPop.document.readyState !== 'complete';) {
      if (oPop.document.readyState === 'complete') break
    }
    oPop.document.execCommand('SaveAs')
    oPop.close()
  } else { // IE10+下载
    window.navigator.msSaveBlob(blob, fileName)
  }
}

export function downloadFileByUrl (url) {
  if (myBrowser() === 'IE' || myBrowser() === 'Edge') { // IE下载
    var oPop = window.open(url, '', 'width=1, height=1, top=5000, left=5000')
    for (; oPop.document.readyState !== 'complete';) {
      if (oPop.document.readyState === 'complete') break
    }
    oPop.document.execCommand('SaveAs')
    oPop.close()
  } else { // 非IE下载
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', '')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link) // 下载完成移除元素
  }
}
