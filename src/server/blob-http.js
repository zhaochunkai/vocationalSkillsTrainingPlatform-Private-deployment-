import request from '../utils/blob-request'
import { Message } from 'element-ui'
function http (url, params = {}, method = 'GET') {
  return new Promise((resolve, reject) => {
    let req
    if (method === 'GET' || method === 'DELETE') {
      req = { url, method, params }
    } else {
      req = { url, method, data: params }
    }    
    request(req).then(({data, status}) => {
      if (status === 200 || status === 204) {
        resolve(data)
      } else {
        Message.error('系统返回错误')
        reject(data)
      }
    }).catch(({data}) => {
      reject(data.error)
    })
  })
}

export default http
