"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pageSize = exports.pageSizes = exports.baseURL = void 0;
// 请求接口的前缀路径
// export const baseURL = '__BASE_URL__'
var baseURL = 'http://ets-private.gd'; // export const baseURL = 'http://10.0.0.9:5000'
// export const baseURL = 'http://3e14583x13.zicp.vip'
// 页码数

exports.baseURL = baseURL;
var pageSizes = [10, 20, 50]; // 页码数数组

exports.pageSizes = pageSizes;
var pageSize = 10; // 默认页码数

exports.pageSize = pageSize;