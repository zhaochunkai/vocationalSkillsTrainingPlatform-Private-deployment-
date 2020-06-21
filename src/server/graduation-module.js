import http from './http'

/* ----------------------------- 毕业管理-毕业判定 -------------------------- */
// 创建毕业判定条件
export const createGraduationJudgement = (data) => http('/Api/GraduationJudgement/CreateGraduationJudgement', data, 'POST')
// 获得毕业判定条件分页列表
export const getGraduationJudgement = (data) => http('/Api/GraduationJudgement/GetGraduationJudgementList', data)
// 更新毕业判定条件
export const updateGraduationJudgement = (data) => http('/Api/GraduationJudgement/UpdateGraduationJudgement?id=' + data.id, data, 'PUT')
// 获取毕业判定条件详情
export const getGraduationJudgementById = (id) => http('/Api/GraduationJudgement/GetGraduationJudgement?id=' + id, {})
// 删除毕业判定条件
export const deleteGraduationJudgementById = (id) => http('/Api/GraduationJudgement/DeleteJudgement?id=' + id, {}, 'DELETE')

/* ----------------------------- 毕业管理-毕业记录 -------------------------- */
// 获取毕业记录详情
export const getGraduationRecordById = (id) => http('/Api/GraduationRecord/' + id, {})
// 获取班级毕业记录分页列表
export const getGraduationRecord = (data) => http('/Api/GraduationRecord', data)
// 审批毕业记录
export const updateGraduationRecordApprove = (data) => http('/Api/GraduationRecord/Approve', data, 'PUT')
// 修改毕业记录达标状态
export const updateGraduationRecordPassState = (id, data) => http('/Api/GraduationRecord/PassState?id=' + id, data, 'PUT')
// 毕业自动判定
export const createGraduationRecordAutoJudge = (projectId) => http('/Api/GraduationRecord/JudgeGraduationAutomatically/' + projectId, {}, 'POST')

/* ----------------------------- 基础数据-毕业要求证书类型 -------------------------- */
// 获取毕业要求证书类型分页列表
export const getGraduationRequiredCertificateTypeLists = (data) => http('/Api/RequiredCertificateType', data)
// 创建毕业要求证书类型
export const createRequiredCertificateType = (data) => http('/Api/RequiredCertificateType', data, 'POST')
// 更新毕业要求证书类型
export const updateRequiredCertificateType = (data) => http('/Api/RequiredCertificateType?id=' + data.id, data, 'PUT')
// 删除毕业要求证书类型
export const deleteRequiredCertificateType = (id) => http('/Api/RequiredCertificateType?id=' + id, {}, 'DELETE')
// 获取毕业要求证书类型详情
export const getRequiredCertificateTypeById = (id) => http('/Api/RequiredCertificateType/' + id, {})
// 根据培训项目Id获取列表
export const getRequiredCertificateTypeByTrainingProgramsId = (trainingProgramsId) => http('/Api/RequiredCertificateType/ByTrainingProgramsId?trainingProgramsId=' + trainingProgramsId, {})
// 获取毕业要求证书类型下拉列表
export const getGraduationRequiredCertificateTypePullDown = (data) => http('/Api/RequiredCertificateType/PullDown', data)
