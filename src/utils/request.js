import axios from 'axios'
import { baseURL } from '../config'
import ElementUI from 'element-ui'
// import main from '../main'

const request = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  }
})

/**
 * 请求拦截
 */
request.interceptors.request.use(config => {
  // 对请求数据做点什么
  // token
  let Authorization = localStorage.getItem('Authorization')
  if (Authorization && Authorization !== 'undefined') {
    Authorization = JSON.parse(Authorization)
    config.headers['Authorization'] = Authorization.token_type + ' ' + Authorization.access_token
  }
  // 短信中心
  let MsgConfiguration = JSON.parse(sessionStorage.getItem('MsgConfiguration'))
  if (MsgConfiguration && !!MsgConfiguration.AppId) {
    config.headers['AppId'] = MsgConfiguration.AppId
  }
  if (MsgConfiguration && !!MsgConfiguration.AppSecret) {
    config.headers['AppSecret'] = MsgConfiguration.AppSecret
  }
  return config
}, error => {
  // 对请求错误做点什么
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
request.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response
  },
  error => {
    // 对响应错误做点什么
    if (error.response) {
      if (error.response.status === 401) {
        ElementUI.MessageBox({
          title: '提示',
          message: '登录已失效，请重新登录！',
          confirmButtonText: '确定'
        }).then(() => {
          localStorage.removeItem('Authorization')
          location.replace('/')
        })
      } else if (error.response.status === 403) {
        ElementUI.Message({
          message: `${error.response.data.error.message}`,
          type: 'error'
        })
      } else if (error.response.status === 404) {
        ElementUI.Message({
          message: '数据未找到',
          type: 'warning'
        })
      } else if (error.response.status === 500) {
        ElementUI.Message({
          message: '服务器内部错误',
          type: 'error'
        })
      } else {
        return Promise.reject(error.response)
      }
    }
  }
)

export default request
