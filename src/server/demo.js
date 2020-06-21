import http from './http'

export default {
  demo: function (data) {
    return http('demo/list', data)
  }
}
