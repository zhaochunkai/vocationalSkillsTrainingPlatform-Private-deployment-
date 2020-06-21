import axios from 'axios'
import { baseURL } from "../config"
import ElementUI from 'element-ui'

const request = axios.create({
  baseURL: baseURL,
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  },
})

/*
 * 请求拦截
 */
request.interceptors.request.use(config => {
  // 对请求数据做点什么
  // token
  let Authorization = localStorage.getItem('Authorization')
  if (Authorization && Authorization!='undefined') {
    Authorization = JSON.parse(Authorization)
    config.headers['Authorization'] = Authorization.token_type + ' ' + Authorization.access_token
  }
    return config;
  }, 
  error => {
    // 对请求错误做点什么
    return Promise.reject(error)
  }
)

/**
 * 响应拦截
 */
request.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response
  },
  error => {
    console.log(error.response)
    // 对响应错误做点什么
    if (error.response) {
      // if (error.response.status === 401) {
      //   // 判断res.data.res_code 是否是401 如果是则跳转到登录，如果不是则正常返回
      //   ElementUI.MessageBox({
      //     title: '提示',
      //     message: '登录已失效，请重新登录！',
      //     confirmButtonText: "确定"
      //   }).then(() => {
      //     localStorage.removeItem('Authorization')
      //     location.replace('/')  
      //   })
      // } else 
      if (error.response.status === 401) {       
        ElementUI.MessageBox({
          title: '提示',
          message: '您没有该操作权限，请联系管理员授权',
          confirmButtonText: "确定"
        })
      }
      
    }
    return Promise.reject(error.response)
  }
)

export default request
