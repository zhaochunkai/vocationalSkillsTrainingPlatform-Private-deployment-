import http from './file-http'

/* ------------------------------ 基础数据-文件上传- 单个 ------------------------------------- */
// 文件上传
export const UploadExternalFiles = (data) => http('/Api/ExternalFiles/Upload', data, 'POST')
// 文件下载
// export const DownloadExternalFiles = (filekey) => http(`/Api/ExternalFiles/Download?filekey=${filekey}`, {})
// 文件预览
export const getPreviewFile = (filekey) => http(`/Api/ExternalFiles/Preview?filekey=${filekey}`, {})
/* ------------------------------ 资源维护 ------------------------------------- */
// 创建新的资源
export const createResource = (data) => http('/Api/Resource', data, 'POST')
/* ------------------------------ 学生信息导入导出 ------------------------------------- */
// 报名信息导入，单个文件上传
export const StudentInfoImporting = (data) => http('/Api/StudentInfoImportingExport/Importing', data, 'POST')
