import http from './blob-http'

/* ------------------------------ 二进制文件下载 ------------------------------ */
// 资源等文件下载
export const DownloadExternalFiles = (filekey) => http(`/Api/ExternalFiles/Download?filekey=${filekey}`, {})
// 导出试题模板
export const getGenerateTemplate = () => http('/Api/Question/GenerateTemplate', {})
// 下载导入学生模板
export const getStudentInfoTemplate = () => http('/Api/StudentInfo/DownloadImportStudentInfo', {})
// 导出项目下的学生缴费信息
export const exportPayInfoList = (data) => http('/Api/Pay/ExportPayInfo', data)
